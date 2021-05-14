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

function CountryView({ run, country, range, session, dispatch }) {
  const history = useHistory();
  const factors = [
    'rank', 'score', 'economy', 'family', 'health',
    'freedom', 'generosity', 'trust'
  ];

  const { xAxis, checked, dataset } = session;
  const { setXAxis, setChecked, setDataset, setLast } = dispatch;
  const [status, setStatus] = useState(undefined);

  const setAxis = (factor, val) => {
    let idx = factors.findIndex(f => f === factor);
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
    const { last } = session;
    let current = JSON.stringify({ country, range });

    if (dataset && last === current) {
      console.log('using previous dataset for graph');
      setStatus('loaded');
      return;
    } else {
      setDataset(undefined);
    }

    let [start, end] = range;

    if (Number(start) > Number(end)) {
      setStatus(undefined);
      return;
    }

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
    setLast(current);
    setStatus('loaded');
  };

  useEffect(() => {
    if (run && country) {
      onLoad();
    }
  }, [run, country, range]);

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
                <option key={0} selected={!xAxis}>Select</option>
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
              {xAxis && <Chart
                options={generateOptions(xAxis, dataset)}
                series={generateSeries(checked, dataset, factors)}
                type='line'
                height='100%'
                width='99%'
              />}
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
    let entry = { name: toTitleCase(active[i]), data: points };
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

const mapDispatchToProps = dispatch => {
  return {
    dispatch: {
      setXAxis: value => dispatch({ type: 'graph', sub: 'xAxis', payload: value }),
      setChecked: checked => dispatch({ type: 'graph', sub: 'checked', payload: checked }),
      setLast: last => dispatch({ type: 'graph', sub: 'last', payload: last }),
      setDataset: data => dispatch({ type: 'graph', sub: 'dataset', payload: data })
    }
  }
};

const mapStateToProps = state => {
  const { graph } = state;
  return {
    session: graph
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CountryView);

