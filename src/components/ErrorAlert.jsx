import React from 'react';
import { Alert, Col } from 'react-bootstrap-v5';

function ErrorAlert({ padded = true }) {
  return (
    <Col style={styles.alert}>
      {padded && <br />}
      <Alert variant={'danger'}>
        Error: unable to retrieve data from server
      </Alert>
    </Col>
  );
}

const styles = {
  alert: {
    height: '100%',
    paddingLeft: '20px',
    paddingRight: '20px'
  }
};

export default ErrorAlert;
