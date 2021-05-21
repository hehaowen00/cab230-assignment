import React from 'react';
import { Alert, Col } from 'react-bootstrap-v5';

function ErrorAlert({ padded = true }) {
  return (
    <Col className='alert'>
      {padded && <br />}
      <Alert variant={'danger'}>
        Error: unable to retrieve data from server
      </Alert>
    </Col>
  );
}

export default ErrorAlert;
