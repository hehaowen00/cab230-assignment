import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Chart from "react-apexcharts";
import { fetchCountryRankings } from '../../utils/functions';

import { Alert } from 'react-bootstrap-v5';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

function CountryView({ plot, country, rankings, years }) {
  const [status, setStatus] = useState('loading');
  const [countryData, setCountryData] = useState([]);
  const [range, setRange] = useState([undefined, undefined]);

  const load = async () => {
    console.log(plot);
    let data = undefined;
    let diff = [];

    for (let i = 0; i < years.length; i++) {
      if (years[i] in rankings) {
        let search = rankings[years[i]];

        if (search === []) {
          break;
        }

        for (let j = 0; j < search.length; j++) {
          if (search[j].country === country) {
            diff.push(search[j]);
          }
        }
      } else {
        break;
      }
    }

    if (diff.length < 5) {
      let resp = await fetchCountryRankings(country);
      const { type } = resp;

      if (type === 'error') {
        setStatus('error');
        return;
      }
      if (type === 'success') {
        console.log(`retrieved rankings for ${country}`);
        data = resp.data;
      }
    } else {
      console.log(`retrieved rankings for ${country} using redux`);
      data = diff;
    }

    const a = data[0].year;
    const b = data[data.length - 1].year;

    if (Number(a) > Number(b)) {
      setRange([b, a]);
    }

    if (Number(a) < Number(b)) {
      setRange([b, a]);
    }

    if (Number(a) === Number(b)) {
      setRange([b, a]);
    }

    setCountryData(data);
    setStatus('loaded');
  };

  useEffect(() => {
    if (country !== undefined) {
      load();
    }
  }, [country]);

  return (
    <Fragment>
      {country !== undefined &&
        <Fragment>
          {status === 'loading' && <p>Loading data...</p>}
          {status === 'loaded' &&
            <Fragment>
              <AgGridReact className='ag-theme-alpine' rowData={countryData}
                containerStyle={{ height: '40%' }}>
                <AgGridColumn field='year' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
                <AgGridColumn field='rank' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
                <AgGridColumn field='score' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
              </AgGridReact>
              <br />
              <Chart
                options={options({ plot, years, country, range })}
                series={series(plot, countryData)}
                type='line'
              />
            </Fragment>
          }
          {status === 'error' &&
            <Alert variant={'danger'}>
              Error: unable to fetch data from server
        </Alert>
          }
        </Fragment>
      }
    </Fragment>
  );
}

const rankOptions = (country, range) => {
  const [start, end] = range;
  return {
    text: `${country} Happiness Rankings (${start} - ${end})`
  };
};

const scoreOptions = (country, range) => {
  const [start, end] = range;
  return {
    text: `${country} Happiness Scores (${start} - ${end})`
  };
};

const rankSeries = (data) => {
  let ranks = data.reduce((a, x) => [...a, x.rank], []);

  return [
    {
      name: 'rank',
      data: ranks
    }
  ];
};

const scoreSeries = (data) => {
  let ranks = data.reduce((a, x) => [...a, x.score], []);

  return [
    {
      name: 'rank',
      data: ranks
    }
  ];
};

const options = ({ plot, years, country, range }) => {
  return {
    chart: {
      id: 'basic-bar'
    },
    title: plot === 'Rank' ? rankOptions(country, range) : scoreOptions(country, range),
    xaxis: {
      title: { text: 'Year' },
      categories: years,
    },
    yaxis: {
      title: { text: plot == 'Rank' ? 'Rank' : 'Score' },
    }
  };
};

const series = (plot, data) => plot === 'Rank' ? rankSeries(data) : scoreSeries(data);

const mapStateToProps = state => {
  const { data } = state;
  return {
    rankings: data.rankings,
    years: data.years
  };
};

export default connect(mapStateToProps)(CountryView);
