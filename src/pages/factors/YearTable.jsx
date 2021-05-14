import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Col, Alert } from 'react-bootstrap-v5';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';

import { AddFactorsYear } from '../../redux/actions/Data';
import { fetchFactorsLimit } from '../../utils/functions';
import { getJWT } from '../../utils/jwt';

function YearTable({ addFactorsYear, factors, run, year, limit }) {
  const history = useHistory();
  const [status, setStatus] = useState(undefined);
  const [factorsData, setFactorsData] = useState(undefined);
  const factorsList = [
    'rank', 'country', 'score', 'economy', 'family', 'health',
    'freedom', 'generosity', 'trust'
  ];

  const load = async () => {
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
        {status === 'loading' && <LoadingAlert />}
        {status === 'error' && <ErrorAlert />}
        {status === 'loaded' && factorsData &&
          <Col style={{ width: '100%' }}>
            <AgGridReact className='ag-theme-alpine' pagination={true}
              paginationPageSize={25} rowData={factorsData}
              containerStyle={{ height: '100%', width: '100%' }}>
              {factorsList.map(f =>
                <AgGridColumn field={f} filter='agNumberColumnFilter' sortable={true}></AgGridColumn>)}
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
