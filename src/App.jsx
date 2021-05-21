import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap-v5';
import ErrorAlert from './components/ErrorAlert';
import Sidebar from './components/Sidebar';

import Home from './pages/Home'
import Login from './pages/Login';
import Logout from './pages/Logout';
import Rankings from './pages/Rankings';
import Factors from './pages/Factors';
import Register from './pages/Register';

import { LoginAction } from './redux/actions/User';
import { fetchCountries } from './utils/dataFunctions';
import { getJWT } from './utils/jwt';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App({ setAuth, setCountries }) {
  const [status, setStatus] = useState('loading');

  async function onStart() {
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
    <Container fluid className='min-vh-100 min-vw-100 d-flex app-view'>
      <Router>
        {status === 'loaded' && 
          <Sidebar />
        }
        <div className='content-view'>
          {status === 'loaded' &&
            <Routes />
          }
          {status === 'error' &&
            <Container fluid className='page-view padded'>
              <main className='flex-shrink-0'>
                <h4>World Happiness Rankings</h4>
                <p>Explore data from 2015 to 2020 on happiness in countries around the world</p>
                <ErrorAlert padded={false} />
              </main>
            </Container>
          }
        </div>
      </Router>
    </Container>
  );
}

function Routes() {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/rankings' component={Rankings} />
      <Route path='/factors' component={Factors} />
      <Route path='/register' component={Register} />
      <Route path='/login' component={Login} />
      <Route path='/logout' component={Logout} />
    </Switch>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setAuth: email => dispatch(LoginAction(email)),
    setCountries: data => dispatch({ type: 'setCountries', payload: data })
  };
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
