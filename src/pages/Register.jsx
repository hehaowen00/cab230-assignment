import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import HiddenAlert, { EMPTY } from '../components/HiddenAlert'

import { REGISTER_URL } from '../util';

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

function Register() {
  const [alert, setAlert] = useState(EMPTY);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    let resp = await fetch(REGISTER_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    setAlert(ALERTS[resp.status]);
  };

  return (
    <Container className='content'>
      <Row>
        <Col>&nbsp;</Col>
        <Col xl='4' className='text-center'>
          <h4>Register</h4>
        </Col>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col>&nbsp;</Col>
        <Col md='7' lg='7' xl='5' >
          <Form onSubmit={submitForm}>
            <Form.Group controlId='registration'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type='email' placeholder='Email Address'
                required={true} value={email} onChange={updateEmail} />
              <p></p>
              <Form.Label>Password</Form.Label>
              <Form.Control type={isVisible ? 'text' : 'password'}
                minLength='8' placeholder='Password'
                required={true} value={password} onChange={updatePassword} />
              <br />
              <Form.Check type="checkbox" label="Show Password"
                value={isVisible} onChange={updateVisibility} />
            </Form.Group>
            <br />
            <HiddenAlert alert={alert} set={setAlert} />
            <Button className='btn-block' variant='primary' type='submit'>Register</Button>
          </Form>
        </Col>
        <Col>&nbsp;</Col>
      </Row>
    </Container>
  );
}

export default Register;

