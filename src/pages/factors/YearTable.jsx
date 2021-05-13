import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Col, Alert } from 'react-bootstrap-v5';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import { AddFactorsYear } from '../../redux/actions/Data';
import { fetchFactorsLimit } from '../../utils/functions';
import { getJWT } from '../../utils/jwt';

function YearTable({ addFactorsYear, factors, run, year, limit }) {
  const history = useHistory();
  const [status, setStatus] = useState(undefined);
  const [factorsData, setFactorsData] = useState(undefined);

  console.log('year table');

  const load = async () => {
    console.log('load');
    setStatus('loading');

    let data = undefined;

    if (year in factors && factors[year].length >= limit) {
      console.log('retrieved factors from redux store');
      data = factors[year].slice(0, limit);
    } else {
      let res = getJWT();

      if (res.type === 'error') {
        history.push('/login');
      }

      let resp = await fetchFactorsLimit(res.token, year, limit ? limit : '');
      const { type } = resp;

      if (type === 'error') {
        setStatus('error');
        return;
      }

      if (type === 'success') {
        console.log('retrieved factors from API');
        data = resp.data;
        console.log('storing factors data in redux');
        addFactorsYear(year, data);
      }
    }

    setFactorsData(data);
    setStatus('loaded');
  };

  useEffect(() => {
    console.log(year, limit, run);
    if (run && year !== undefined && limit !== undefined) {
      load();
    }
  }, [run, year, limit]);

  return (
    <Fragment>
      <Fragment>
        {status === 'loading' &&
          <Col style={styles.alert}>
            <Alert variant={'info'}>
              Loading data...
            </Alert>
          </Col>
        }
        {status === 'error' &&
          <Col style={styles.alert}>
            <br />
            <Alert variant={'danger'}>
              Error: unable to fetch data from server
            </Alert>
          </Col>
        }
        {status === 'loaded' && factorsData &&
            <Col style={{width: '100%' }}>
          <AgGridReact className='ag-theme-alpine' pagination={true}
            paginationPageSize={25} rowData={factorsData}
            containerStyle={{ height: '100%', width: '100%' }}>
            <AgGridColumn field='rank' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            <AgGridColumn field='country' filter={true} sortable={true}></AgGridColumn>
            <AgGridColumn field='score' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            <AgGridColumn field='economy' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            <AgGridColumn field='family' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            <AgGridColumn field='health' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            <AgGridColumn field='freedom' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            <AgGridColumn field='generosity' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            <AgGridColumn field='trust' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
          </AgGridReact>
            </Col>
        }
      </Fragment>
    </Fragment>
  );
}

const styles = {
  alert: {
    height: '100%',
    paddingLeft: '20px',
    paddingRight: '20px'
  }
};

const mapDispatchToProps = dispatch => {
  return {
    addFactorsYear: (year, data) => dispatch(AddFactorsYear(year, data))
  };
};

const mapStateToProps = state => {
  const { data } = state;
  return {
    factors: data.factors
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(YearTable);
