import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Col } from 'react-bootstrap-v5';

import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';

import { AddFactors } from '../../redux/actions/Data';
import { fetchFactors } from '../../utils/dataFunctions';
import { getJWT } from '../../utils/jwt';

function TableView({ factors, factorsList, run, year, limit, addFactors, setRun }) {
  const history = useHistory();
  const [status, setStatus] = useState(undefined);
  const [factorsData, setFactorsData] = useState(undefined);

  const onLoad = useCallback(async () => {
    setRun(false);
    setStatus('loading');

    let res = getJWT();
    if (res.type === 'error') {
      history.push('/login');
    }

    let data = undefined;

    if (year in factors && factors[year].length >= limit) {
      console.log('retrieved factors from redux store');
      data = factors[year].slice(0, limit);
    } else {
      const params = { year, limit: limit ? limit : undefined };
      let resp = await fetchFactors(params, res.token);

      const { type } = resp;
      if (type === 'error') {
        setStatus('error');
        return;
      }

      if (type === 'success') {
        console.log('retrieved factors from API');
        data = resp.data;
        console.log('storing factors data in redux');
        addFactors(year, data);
      }
    }

    setFactorsData(data);
    setStatus('loaded');
  }, [factors, history, limit, year, addFactors, setRun]);

  useEffect(() => {
    if (run && year && limit) {
      onLoad();
    }
  }, [run, year, limit, onLoad]);

  return (
    <Fragment>
      <Fragment>
        {status === 'loading' && <LoadingAlert />}
        {status === 'error' && <ErrorAlert />}
        {status === 'loaded' && factorsData &&
          <Col className='container-fluid'>
            <AgGridReact className='ag-theme-alpine' pagination={true}
              paginationPageSize={25} rowData={factorsData}
              containerStyle={{ height: '100%' }}>
              {factorsList.map(f =>
                <AgGridColumn field={f} filter='agNumberColumnFilter' sortable={true}></AgGridColumn>)}
            </AgGridReact>
          </Col>
        }
      </Fragment>
    </Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    addFactors: (year, data) => dispatch(AddFactors(year, data))
  };
};

function mapStateToProps(state) {
  const { data, factors } = state;
  return {
    factors: data.factors,
    factorsList: factors.factors
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TableView);
