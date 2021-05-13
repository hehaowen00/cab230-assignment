import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Chart from "react-apexcharts";
import { Alert } from 'react-bootstrap-v5';

function CountryView({ factors, country, start, end }) {
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
      {status === 'loading' && <p>Loading data...</p>}
      {status === 'error' &&
        <Col style={{ height: '100%' }} >
          <Alert variant={'danger'}>
            Error: unable to fetch data from server
            </Alert>
        </Col>
      }
      {status === 'loaded'}
    </Fragment>
  );
}

const mapStateToProps = state => {
  const { data } = state;
  return {
    factors: data.factors
  };
};

export default connect(mapStateToProps)(CountryView);
