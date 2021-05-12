import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Container, Col, Row, Form, Navbar } from 'react-bootstrap-v5';
import SelectElement from '../components/SelectElement';

function Factors({ authenticated }) {
  const history = useHistory();

  const [type, setType] = useState(undefined);
  const [year1, setYear1] = useState(undefined);
  const [year2, setYear2] = useState(undefined);

  useEffect(() => {
    if (!authenticated) {
      history.push('/login');
    }
  }, [authenticated]);

  return (
    <Container fluid className='content-1' style={{ padding: 0, margin: 0 }}>
      <Navbar bg='light' variant='light' sticky='top'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Form className='d-flex form-inline'>
            <SelectElement text='Filter By' onChange={undefined} style={styles.spaced}>
              <option key={0} selected={undefined}>Select</option>
              <option key={1}>Country</option>
              <option key={2}>Year</option>
            </SelectElement>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

const styles = {
  spaced: {
    marginRight: '5px'
  }
};

const mapStateToProps = state => {
  const { user } = state;
  return {
    authenticated: user.authenticated
  };
};

export default connect(mapStateToProps)(Factors);

