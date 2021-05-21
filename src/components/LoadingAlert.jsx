import React from 'react';
import { Alert, Col } from 'react-bootstrap-v5';

function LoadingAlert() {
  return (
    <Col className='alert'>
      <br />
      <Alert variant={'info'}>
        Loading data...
      </Alert>
    </Col>
  );
}

export default LoadingAlert;
