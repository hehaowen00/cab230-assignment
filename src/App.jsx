import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import Visualize from './pages/Visualize';

import { getCountryCode } from './util';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const dispatch = useDispatch();

  return (
    <Container fluid>
      <Router>
        <Navigation />
        <br />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/rankings'>
            <Home />
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
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
