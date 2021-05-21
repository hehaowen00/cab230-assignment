import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Chart from 'react-apexcharts';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';

import { fetchRankings } from '../../utils/dataFunctions';

function CountryView({ plot, country, rankings, years }) {
  const [status, setStatus] = useState('loading');
  const [countryData, setCountryData] = useState([]);
  const [range, setRange] = useState([undefined, undefined]);

  async function onLoad() {
    let data = undefined;
    let diff = [];

    for (let i = 0; i < years.length; i++) {
      if (years[i] in rankings && rankings[years[i]]) {
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
      let resp = await fetchRankings({country});
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
    if (country) {
      onLoad();
    }
  }, [country]);

  return (
    <Fragment>
      {country &&
        <Fragment>
          {status === 'loading' && <LoadingAlert />}
          {status === 'error' && <ErrorAlert />}
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
        </Fragment>
      }
    </Fragment>
  );
}

function rankOptions(country, range) {
  const [start, end] = range;
  return {
    text: `${country} Happiness Rankings (${start} - ${end})`
  };
};

function scoreOptions(country, range) {
  const [start, end] = range;
  return {
    text: `${country} Happiness Scores (${start} - ${end})`
  };
};

function rankSeries(data) {
  let ranks = data.reduce((a, x) => [...a, x.rank], []);

  return [
    { name: 'rank', data: ranks }
  ];
};

function scoreSeries(data) {
  let ranks = data.reduce((a, x) => [...a, x.score], []);

  return [
    { name: 'rank', data: ranks }
  ];
};

function options({ plot, years, country, range }) {
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
      title: { text: plot === 'Rank' ? 'Rank' : 'Score' },
    }
  };
};

function series(plot, data) {
  return plot === 'Rank' ? rankSeries(data) : scoreSeries(data);
}

function mapStateToProps(state) {
  const { data } = state;
  return {
    rankings: data.rankings,
    years: data.years
  };
};

export default connect(mapStateToProps)(CountryView);
