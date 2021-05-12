import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Container, Alert } from 'react-bootstrap-v5';
import Sidebar from './components/Sidebar';

import Home from './pages/Home'
import Login from './pages/Login';
import Logout from './pages/Logout';
import Rankings from './pages/Rankings';
import Factors from './pages/Factors';
import Register from './pages/Register';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { fetchCountries } from './utils/functions';
import { getJWT } from './utils/jwt';

function App({ setAuth, setCountries }) {
  const [status, setStatus] = useState('loading');

  const load = async () => {
    let res = await fetchCountries();
    if (res.type === 'success') {
      console.log('retrieved list of countries');
      setCountries(res.data);
      setStatus('loaded');
    } else {
      console.log('unable to get list of countries');
      setStatus('error');
    }
  };

  useEffect(() => {
    load();

    let res = getJWT();
    if (res.type === 'success') {
      setAuth(res.email);
    }
  });

  return (
    <Container fluid className='min-vh-100 d-flex' style={styles.main}>
      <Router>
        <Sidebar />
        <div style={styles.content}>
          {status === 'loaded' &&
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/rankings' component={Rankings} />
              <Route exact path='/factors' component={Factors} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/logout' component={Logout} />
            </Switch>
          }
          {status === 'error' &&
            <Fragment>
              <br />
              <Alert variant={'danger'} style={{ marginLeft: 20, marginRight: 20 }}>
                Error: unable to fetch data from server
            </Alert>
            </Fragment>
          }
        </div>
      </Router>
    </Container >
  );
}

const styles = {
  main: {
    padding: 0,
    margin: 0
  },
  content: {
    margin: 0,
    width: 'calc(100% - 280px)',
    overflowY: 'none',
    height: '100vh',
    maxHeight: '100%',
    alignItems: 'center',
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAuth: (email) => dispatch({ type: 'userLogin', payload: email }),
    setCountries: (data) => dispatch({ type: 'setCountries', payload: data })
  };
};

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
