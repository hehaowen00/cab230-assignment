import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Col, Container, Form, Row } from 'react-bootstrap-v5';
import { Link } from 'react-router-dom';
import HiddenAlert from '../components/HiddenAlert'

import { registerUser } from '../utils/userFunctions';

function Register({ authenticated }) {
  const history = useHistory();

  useEffect(() => {
    if (authenticated) {
      history.push('/home');
    }
  });

  const [alert, setAlert] = useState(undefined);
  const [isVisible, setVisible] = useState(false);

  function updateVisibility(e) {
    setVisible(!isVisible);
  }

  async function submitForm(e) {
    setAlert(undefined);
    e.preventDefault();

    const { email, password } = e.target;

    const data = {
      email: email.value,
      password: password.value,
    };

    let res = await registerUser(data);
    setAlert(ALERTS[res.status]);
  };

  return (
    <Container className='form-view'>
      <Row className='d-flex justify-content-center'>
        <Col md='7' lg='8' xl='5'>
          <span className='text-center'><h4>Register</h4></span>
          <Form onSubmit={submitForm}>
            <Form.Group controlId='registration'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control name='email' type='email' placeholder='Email Address' required={true} />
              <p></p>
              <Form.Label>Password</Form.Label>
              <Form.Control name='password' type={isVisible ? 'text' : 'password'}
                minLength='8' placeholder='Password' required={true} />
              <br />
              <Form.Check type='checkbox' label='Show Password'
                value={isVisible} onChange={updateVisibility} />
            </Form.Group>
            <br />
            <HiddenAlert alert={alert} />
            <Button className='col-12' variant='primary' type='submit'>Register</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const ALERTS = {
  201: {
    type: 'success', msg: (
      <div>
        <span>Success! User has been created</span>
        <br />
        <Link to='/login'>Click here to login</Link>
      </div>
    )
  },
  400: { type: 'danger', msg: 'Error! Email and password are required' },
  409: { type: 'danger', msg: 'Error! User already exists' },
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    authenticated: user.authenticated
  }
};

export default connect(mapStateToProps)(Register);

