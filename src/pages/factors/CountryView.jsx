import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Alert, Col, Row, Form } from 'react-bootstrap-v5';
import Chart from "react-apexcharts";

import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';
import SelectElement from '../../components/SelectElement';

import {
  XAxisAction,
  CheckedAction,
  LastAction,
  DatasetAction,
} from '../../redux/actions/Graph';
import { OnceAction } from '../../redux/actions/Factors';

import { fetchFactorsCountry } from '../../utils/functions';
import { getJWT } from '../../utils/jwt';

function CountryView({ run, country, range, session, dispatch }) {
  const { xAxis, checked, dataset } = session;
  const { setXAxis, setChecked, setDataset, setLast, setOnce } = dispatch;
  const [status, setStatus] = useState(undefined);

  const history = useHistory();
  const factors = [
    'rank', 'score', 'economy', 'family', 'health',
    'freedom', 'generosity', 'trust'
  ];

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
    if (Number(range[0]) > Number(range[1])) {
      setStatus('range error');
      setOnce();
      return;
    }

    const { last } = session;
    let current = JSON.stringify({ country, range });

    if (dataset && current === last) {
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
        if (results.length > 0) {
          data.push({ year: i, ...results[0] });
        }
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
      {status === 'range error' &&
        <Col style={styles.alert}>
          <br />
          <Alert variant={'danger'}>
            Error: starting year must be greater than or equal to end year
          </Alert>
        </Col>
      }
      {status === 'loaded' &&
        <Col style={{ height: '100%' }}>
          <Row className='g-0' style={styles.tableContainer}>
            <AgGridReact className='ag-theme-alpine' pagination={true}
              paginationPageSize={25} rowData={dataset}
              containerStyle={{ height: '100%', width: '100%' }}>
              <AgGridColumn field='year' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
              {factors.map(f =>
                <AgGridColumn field={f} filter='agNumberColumnFilter' sortable={true}></AgGridColumn>)}
            </AgGridReact>
          </Row>
          <Row className='g-0' style={styles.graphOptions}>
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
            <Col style={styles.graphContainer}>
              {xAxis && <Chart
                options={generateOptions(xAxis, dataset)}
                series={generateSeries(checked, dataset, factors)}
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

const styles = {
  tableContainer: {
    height: '41%',
    overflowY: 'auto',
  },
  graphOptions: {
    height: '59%',
    maxHeight: '55%',
    marginTop: '0.1%',
    padding: '10px'
  },
  graphContainer: {
    height: '100%',
    maxHeight: '100%',
    overflowY: 'hidden'
  },
  alert: {
    height: '100%',
    paddingLeft: '20px',
    paddingRight: '20px'
  }
};

const generateOptions = (xAxis, data) => {
  let axis = getDataPoints(data, xAxis);
  return {
    chart: {
      type: 'scatter',
    },
    xaxis: {
      title: { text: xAxis },
      categories: axis
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    }
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
      setXAxis: value => dispatch(XAxisAction(value)),
      setChecked: checked => dispatch(CheckedAction(checked)),
      setLast: last => dispatch(LastAction(last)),
      setDataset: data => dispatch(DatasetAction(data)),
      setOnce: () => dispatch(OnceAction(false)),
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
