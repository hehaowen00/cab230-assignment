import React from 'react';
import { Alert, Col } from 'react-bootstrap-v5';

function LoadingAlert() {
  return (
        <Col style={styles.alert}>
          <br />
          <Alert variant={'info'}>
            Loading data...
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

export default LoadingAlert;
