import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Col, Row, Form } from 'react-bootstrap-v5';
import Chart from "react-apexcharts";

import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';
import SelectElement from '../../components/SelectElement';

import { getJWT } from '../../utils/jwt';
import { fetchFactorsCountry } from '../../utils/functions';

function CountryView({ run, country, start, end }) {
  const history = useHistory();
  const factors = [
    'rank', 'score', 'economy', 'family', 'health',
    'freedom', 'generosity', 'trust'
  ];

  const [status, setStatus] = useState(undefined);
  const [dataset, setDataset] = useState(undefined);
  const [xAxis, setXAxis] = useState(undefined);
  const [checked, setChecked] = useState(new Array(factors.length - 1).fill(false));

  const setAxis = (factor, val) => {
    let idx = factors.findIndex(f => f === factor);
    console.log(factor, val, idx);

    if (idx > -1) {
      let temp = [...checked];
      temp[idx] = val === undefined ? !checked[idx] : val;
      setChecked(temp);
    }
  };

  const xAxisChanged = (e) => {
    let { value } = e.target;
    if (value === 'Select') {
      setXAxis(undefined);
    } else {
      setXAxis(value);
      setAxis(value, false);
    }
  };

  const onLoad = async () => {
    setStatus('loading');

    let data = [];
    let res = getJWT();

    if (res.type === 'error') {
      history.push('/login');
    }

    for (let i = Number(start); i <= Number(end); i++) {
      let resp = await fetchFactorsCountry(res.token, i, country);
      const { type } = resp;

      if (type === 'error') {
        setStatus('error');
        return;
      }

      if (type === 'success') {
        console.log(`retrieved data from server for ${country} ${i}`)
        let results = resp.data;
        data.push({ year: i, ...results[0] });
      }
    }

    setDataset(data);
    setStatus('loaded');
  };

  useEffect(() => {
    if (run && country != undefined && Number(start) < Number(end)) {
      onLoad();
    }
  }, [run, country, start, end]);

  return (
    <Fragment>
      {status === 'loading' && <LoadingAlert />}
      {status === 'error' && <ErrorAlert />}
      {status === 'loaded' &&
        <Col style={{ height: '100%' }}>
          <Row className='g-0' style={{ height: '41%', overflowY: 'auto' }}>
            <AgGridReact className='ag-theme-alpine' pagination={true}
              paginationPageSize={25} rowData={dataset}
              containerStyle={{ height: '100%', width: '100%' }}>
              <AgGridColumn field='year' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
              {factors.map(f =>
                <AgGridColumn field={f} filter='agNumberColumnFilter' sortable={true}></AgGridColumn>)}
            </AgGridReact>
          </Row>
          <Row className='g-0' style={{ height: '59%', maxHeight: '55%', marginTop: '0.1%', padding: '10px' }}>
            <Col style={{ maxWidth: '20%' }}>
              <SelectElement text='x-axis' onChange={xAxisChanged}>
                <option key={0} selected={xAxis === undefined}>Select</option>
                <option key={1} value='year' selected={xAxis === 'year'}>Year</option>
                {factors.map((f, idx) =>
                  <option key={idx + 2} value={f} selected={xAxis === f}>{toTitleCase(f)}</option>
                )}
              </SelectElement>
              <p></p>
              <p className='input-group-text'>y-axis</p>
              {factors.map((f, idx) =>
                <Form.Check
                  type='checkbox'
                  label={toTitleCase(f)}
                  checked={checked[idx]}
                  disabled={xAxis === f}
                  onChange={() => setAxis(f)}
                />)}
            </Col>
            <Col style={{ height: '100%', maxHeight: '100%', overflowY: 'hidden' }}>
              <Chart
                options={generateOptions(xAxis, dataset)}
                series={generateSeries(checked, dataset, factors)}
                type='line'
                height='100%'
              />
            </Col>
          </Row>
        </Col>
      }
    </Fragment>
  );
}

const generateOptions = (xAxis, data) => {
  let axis = getDataPoints(data, xAxis);
  return {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      title: { text: xAxis },
      categories: axis
    },
  }
};

const generateSeries = (checked, data, factors) => {
  let active = getActiveFactors(checked, factors)
  let series = [];

  for (let i = 0; i < active.length; i++) {
    let points = getDataPoints(data, active[i]);
    let entry = { name: active[i], data: points };
    series.push(entry);
  }

  return series;
};

const getActiveFactors = (checked, factors) => {
  let active = [];

  for (let i = 0; i < factors.length; i++) {
    if (checked[i]) {
      active.push(factors[i]);
    }
  }

  return active;
};

const getDataPoints = (data, factor) => {
  return data.reduce((a, x) => [...a, x[factor]], []);
};

const toTitleCase = s => s.charAt(0).toUpperCase() + s.slice(1);

const mapStateToProps = state => {
  const { data } = state;
  return {
    factors: data.factors,
    years: data.years
  };
};

export default connect(mapStateToProps)(CountryView);


