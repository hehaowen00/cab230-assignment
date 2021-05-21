import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Alert, Col, Row, Form } from 'react-bootstrap-v5';
import Chart from 'react-apexcharts';

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

import { fetchFactors } from '../../utils/dataFunctions';
import { getJWT } from '../../utils/jwt';

function CountryView({ run, country, factors, range, session, dispatch, setRun }) {
  const { xAxis, checked, dataset } = session;
  const { setXAxis, setChecked, setDataset, setLast, setOnce } = dispatch;

  const [status, setStatus] = useState(undefined);
  const history = useHistory();

  const setYAxis = (factor, val) => {
    let idx = factors.findIndex(f => f === factor);
    if (idx > -1) {
      let temp = checked.slice(0);
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
      setYAxis(value, false);
    }
  };

  const onLoad = useCallback(async () => {
    setStatus('loading');
    setRun(false);

    if (Number(range[0]) > Number(range[1])) {
      setStatus('rangeError');
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


    let res = getJWT();
    if (res.type === 'error') {
      history.push('/login');
    }

    let resp = await fetchData(start, end, country, res.token);
    if (resp.type === 'success') {
      setDataset(resp.data);
      setLast(current);
      setStatus('loaded');
    } else {
      setStatus('error')
    }
  }, [country, dataset, history, range, session, setDataset, setLast, setOnce, setRun]);

  useEffect(() => {
    if (run && country) {
      onLoad();
    }
  }, [country, run, onLoad]);

  return (
    <Fragment>
      {status === 'loading' && <LoadingAlert />}
      {status === 'error' && <ErrorAlert />}
      {status === 'rangeError' &&
        <Col className='alert'>
          <br />
          <Alert variant={'danger'}>
            Error: starting year must be greater than or equal to end year
          </Alert>
        </Col>
      }
      {status === 'loaded' &&
        <Col>
          <Row className='table-view g-0'>
            <TableView dataset={dataset} factors={factors} />
          </Row>
          <Row className='graph-view g-0'>
            <Col className='graph-options'>
              <ChartOptions checked={checked} factors={factors} xAxis={xAxis}
                onChange={xAxisChanged} setYAxis={setYAxis} />
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

function TableView({dataset, factors}) {
  return (
    <AgGridReact className='ag-theme-alpine' pagination={true}
      paginationPageSize={25} rowData={dataset}
      containerStyle={{ height: '100%', width: '100%' }}>
      <AgGridColumn field='year' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
      {factors.map(f =>
        <AgGridColumn field={f} filter='agNumberColumnFilter' sortable={true}></AgGridColumn>)}
    </AgGridReact>
  );
}

function ChartOptions({checked, factors, xAxis, onChange, setYAxis}) {
  return (
    <Fragment>
      <SelectElement text='x-axis' onChange={onChange}>
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
          onChange={() => setYAxis(f)}
        />)}
    </Fragment>
  );
}

const styles = {
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

async function fetchData(start, end, country, token) {
  let data = [];

  for (let i = Number(start); i <= Number(end); i++) {
    let res = await fetchFactors({year: i, country}, token);
    const { type } = res;

    if (type === 'error') {
      return { type: 'error' };
    }

    if (type === 'success') {
      let results = res.data;
      if (results.length > 0) {
        data.push({ year: i, ...results[0] });
      }
    }
  }

  return { type: 'success', data };
}

function generateOptions(xAxis, data) {
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

function generateSeries(checked, data, factors) {
  let active = getActiveFactors(checked, factors)
  let series = [];

  for (let i = 0; i < active.length; i++) {
    let points = getDataPoints(data, active[i]);
    let entry = { name: toTitleCase(active[i]), data: points };
    series.push(entry);
  }

  return series;
};

function getActiveFactors(checked, factors) {
  let active = [];

  for (let i = 0; i < factors.length; i++) {
    if (checked[i]) {
      active.push(factors[i]);
    }
  }

  return active;
};

function getDataPoints(data, factor) {
  return data.reduce((a, x) => [...a, x[factor]], []);
};

const toTitleCase = s => s.charAt(0).toUpperCase() + s.slice(1);

function mapDispatchToProps(dispatch) {
  return {
    dispatch: {
      setXAxis: value => dispatch(XAxisAction(value)),
      setChecked: checked => dispatch(CheckedAction(checked)),
      setLast: last => dispatch(LastAction(last)),
      setDataset: data => dispatch(DatasetAction(data)),
      setOnce: () => dispatch(OnceAction(false)),
    }
  };
};

function mapStateToProps(state) {
  const { factors, graph } = state;

  return {
    factors: factors.factors.filter(x => x !== 'country'),
    session: graph
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CountryView);

