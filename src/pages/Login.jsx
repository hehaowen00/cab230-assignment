import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Container, Form, Row, Col } from 'react-bootstrap-v5';
import HiddenAlert from '../components/HiddenAlert'
import { ClearRedirectAction, LoginAction } from '../redux/actions/User';

import { storeJWT } from '../utils/jwt';
import { loginUser } from '../utils/userFunctions';

function Login({ authenticated, redirect, setAuth, clearRedirect }) {
  const history = useHistory();

  if (authenticated) {
    history.push('/home');
  }

  const [alert, setAlert] = useState(undefined);
  const [isVisible, setVisible] = useState(false);

  function updateVisibility() {
    setVisible(!isVisible);
  }

  async function submitForm(e) {
    e.preventDefault();
    setAlert(undefined);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const data = {
      email: email,
      password: password,
    };

    let res = await loginUser(data);
    const { type } = res;

    if (type === 'success') {
      const { token, expires_in } = res.data;

      let expires_at = new Date();
      expires_at.setSeconds(expires_at.getSeconds() + expires_in);

      let data = { email, token, expires_at };
      storeJWT(data);
      setAuth(email);

      let temp = redirect;
      clearRedirect();
      history.push(temp ? temp : '/');
    } else {
      setAlert(ALERTS[res.status]);
    }
  };

  return (
    <Container className='form-view'>
      <Row className='d-flex justify-content-center'>
        <Col md='7' lg='7' xl='5' >
          <span className='text-center'><h4>Login</h4></span>
          <Form onSubmit={submitForm}>
            <Form.Group controlId='login'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control name='email' type='email'
                placeholder='Email Address' required={true} />
              <p></p>
              <Form.Label>Password</Form.Label>
              <Form.Control name='password' type={isVisible ? 'text' : 'password'}
                minLength='8' placeholder='Password' required={true} />
              <br />
              <Form.Check type='checkbox' label='Show Password'
                value={isVisible} onChange={updateVisibility} />
            </Form.Group>
            <br />
            {alert !== undefined && <HiddenAlert alert={alert} set={setAlert} />}
            <Button className='col-12' variant='primary' type='submit'>Login</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const ALERTS = {
  400: { type: 'danger', msg: 'Error: Email and password are required' },
  401: { type: 'danger', msg: 'Error: Incorrect email or password' },
};

function mapDispatchToProps(dispatch) {
  return {
    setAuth: email => dispatch(LoginAction(email)),
    clearRedirect: () => dispatch(ClearRedirectAction())
  };
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    authenticated: user.authenticated,
    redirect: user.redirect
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

