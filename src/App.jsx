import React, {useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import Visualize from './pages/Visualize';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

function App() {
  useEffect(async () => {
    // fetch rankings
    // check if user jwt is set
    // check if jwt is valid
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
    alignItems: 'center',
    paddingTop: '40px'
  }
}

export default App;
