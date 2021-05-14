import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import HiddenAlert, { EMPTY } from '../components/HiddenAlert'
import { Button, Container, Form, Row, Col } from 'react-bootstrap-v5';

import { UserLogin } from '../redux/actions/User';
import { LOGIN_URL } from '../utils/definitions';
import { storeJWT } from '../utils/jwt';

const ALERTS = {
  400: { type: 'danger', msg: 'Error! Email and password are required' },
  401: { type: 'danger', msg: 'Error! Incorrect email or password' },
};

function Login({ authenticated, redirect, setAuth }) {
  const history = useHistory();

  useEffect(() => {
    if (authenticated) {
      history.push('/home');
    }
  });

  const [alert, setAlert] = useState(EMPTY);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [isVisible, setVisible] = useState(false);

  const updateEmail = (e) => {
    let { value } = e.target;
    setEmail(value);
  };

  const updatePassword = (e) => {
    let { value } = e.target;
    setPassword(value);
  };

  const updateVisibility = () => {
    setVisible(!isVisible);
  }

  const submitForm = async (e) => {
    e.preventDefault();

    let resp = await fetch(LOGIN_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    let json = await resp.json();

    if (resp.status === 200) {
      // store token
      const { token, expires_in } = json;
      let expires_at = new Date();
      expires_at.setSeconds(expires_at.getSeconds() + expires_in);

      storeJWT(email, token, expires_at);
      setAuth(email);

      history.push('/home');
    } else {
      setAlert(ALERTS[resp.status]);
    }
  };

  return (
    <Container className='content'>
      <Row className='d-flex justify-content-center'>
        <Col md='7' lg='7' xl='5' >
          <span className='text-center'><h4>Login</h4></span>
          <Form onSubmit={submitForm}>
            <Form.Group controlId='login'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type='email' placeholder='Email Address'
                required={true} value={email} onChange={updateEmail} />
              <p></p>
              <Form.Label>Password</Form.Label>
              <Form.Control type={isVisible ? 'text' : 'password'}
                minLength='8' placeholder='Password'
                required={true} value={password} onChange={updatePassword} />
              <br />
              <Form.Check type='checkbox' label='Show Password'
                value={isVisible} onChange={updateVisibility} />
            </Form.Group>
            <br />
            <HiddenAlert alert={alert} set={setAlert} />
            <Button className='col-12' variant='primary' type='submit'>Login</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setAuth: email => dispatch(UserLogin(email)),
    clearRedirect: () => dispatch({ type: 'clearRedirect' })
  };
};

const mapStateToProps = state => {
  const { user } = state;
  return {
    authenticated: user.authenticated,
    redirect: user.redirect
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

