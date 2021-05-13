import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Chart from "react-apexcharts";

import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';

import { Alert, Col } from 'react-bootstrap-v5';
function CountryView({ factors, run, country, start, end }) {
  const [status, setStatus] = useState(undefined);

  const onLoad = async () => {
    setStatus('loading');
  };

  useEffect(() => {
    if (run && country != undefined) {
      onLoad();
    }
  }, [run, country, start, end]);

  return (
    <Fragment>
      {status === 'loading' && <LoadingAlert />}
      {status === 'error' && <ErrorAlert />}
      {status === 'loaded'}
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

const mapStateToProps = state => {
  const { data } = state;
  return {
    factors: data.factors
  };
};

export default connect(mapStateToProps)(CountryView);

