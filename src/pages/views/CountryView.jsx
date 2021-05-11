import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Chart from "react-apexcharts";
import { fetchCountryRankings } from '../../utils/functions';

import { Alert } from 'react-bootstrap-v5';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

const rankOptions = (country, range) => {
  return {
    text: `${country} Happiness Rankings (${range[0]}- ${range[1]})`
  };
};

const scoreOptions = (country, range) => {
  return {
    text: `${country} Happiness Scores (${range[0]}- ${range[1]})`
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

function CountryView({ plot, country, rankings, years }) {
  const [status, setStatus] = useState('loading');
  const [countryData, setCountryData] = useState([]);
  const [range, setRange] = useState([undefined, undefined]);

  const options = {
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

  const series = plot === 'Rank' ? rankSeries(countryData) : scoreSeries(countryData);

  const load = async () => {
    let data = undefined;
    let diff = [];

    let hasAllYears = years.every(year => rankings.hasOwnProperty(year));

    if (hasAllYears) {
      for (let i = 0; i < years.length; i++) {
        let search = rankings[years[i]];

        if (search === []) {
          break;
        }

        for (let j = 0; j < search.length; j++) {
          if (search[j].country === country) {
            diff.push(search[j]);
          }
        }
      }
    }

    if (!hasAllYears) {
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
            options={options}
            series={series}
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
  );
}

const mapStateToProps = state => {
  const { data } = state;
  return {
    rankings: data.rankings,
    years: data.years
  };
};

export default connect(mapStateToProps)(CountryView);
