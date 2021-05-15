import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { Container } from 'react-bootstrap-v5';
import ErrorAlert from './components/ErrorAlert';
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

  const onStart = async () => {
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
    onStart();

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
              <Route exact path='/home' component={Home} />
              <Route exact path='/rankings' component={Rankings} />
              <Route exact path='/factors' component={Factors} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/logout' component={Logout} />
              <Route exact path='/'>
                <Redirect exact to='/home' />
              </Route>
            </Switch>
          }
          {status === 'error' &&
            <Container fluid className='content-1'>
              <main className='flex-shrink-0'>
                <h4>World Happiness Rankings</h4>
                <p>Explore data from 2015 to 2020 on happiness in countries around the world</p>
                <ErrorAlert padded={false} />
              </main>
            </Container>
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
    setAuth: (email) => dispatch({ type: 'user', sub: 'userLogin', payload: email }),
    setCountries: (data) => dispatch({ type: 'setCountries', payload: data })
  };
};

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
