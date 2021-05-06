import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import HiddenAlert, { EMPTY } from '../components/HiddenAlert'
import { Button, Container, Form, Row, Col } from 'react-bootstrap';

import { LOGIN_URL } from '../util';

const ALERTS = {
  400: { type: 'danger', msg: 'Error! Email and password are required' },
  401: { type: 'danger', msg: 'Error! Incorrect email or password' },
};

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [alert, setAlert] = useState(EMPTY);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [isVisible, setVisible] = useState(false);

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateVisibility = (e) => {
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
    console.log(json);

    if (resp.status === 200) {
      // store token
      const { token } = json;
      localStorage.setItem('jwt-token', token);

      // redirect to home
      // history.push('/');
    } else {
      setAlert(ALERTS[resp.status]);
    }
  };

  return (
    <Container className='content'>
      <Row>
        <Col>&nbsp;</Col>
        <Col lg='6' className='text-center'>
          <h4>Login</h4>
        </Col>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
        <Col lg='6'>
          <Form onSubmit={submitForm}>
            <Form.Group controlId='login'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type='email' placeholder='Email Address'
                required={true} value={email} onChange={updateEmail} />

              <Form.Label>Password</Form.Label>
              <Form.Control type={isVisible ? 'text' : 'password'}
                minLength='8' placeholder='Password'
                required={true} value={password} onChange={updatePassword} />

              <Form.Check type="checkbox" label="Show Password"
                value={isVisible} onChange={updateVisibility} />
            </Form.Group>

            <HiddenAlert alert={alert} set={setAlert} />
            <Button className='btn-block' variant='primary' type='submit'>Login</Button>
          </Form>
        </Col>
        <Col>&nbsp;</Col>
      </Row>
    </Container>
  );
}

export default connect(null, {})(Login);

