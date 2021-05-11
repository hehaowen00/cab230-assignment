import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap-v5';
import Sidebar from './components/Sidebar';

import About from './pages/About';
import Home from './pages/Home'
import Login from './pages/Login';
import Rankings from './pages/Rankings';
import Register from './pages/Register';
import Visualize from './pages/Visualize';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getJWT } from './utils/jwt';

function App({ setAuth }) {
  useEffect(() => {
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
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/rankings'>
              <Rankings />
            </Route>
            <Route exact path='/visualize'>
              <Visualize />
            </Route>
            <Route exact path='/register'>
              <Register />
            </Route>
            <Route exact path='/login'>
              <Login />
            </Route>
            <Route exact path='/about'>
              <About />
            </Route>
          </Switch>
        </div>
      </Router>
    </Container>
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
    setAuth: (email) => dispatch({ type: 'userLogin', payload: email })
  };
};

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
