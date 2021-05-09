import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Form, FormControl, Navbar, Nav } from 'react-bootstrap';

import { AddRanking, AddRankings } from '../redux/actions/Data';
import { fetchRankings } from '../utils/functions';

function Rankings({ rankings, addRankings }) {
  const [status, setStatus] = useState('');

  const load = async (year) => {
    let data = rankings[year];

    if (!(year in rankings)) {
      let res = await fetchRankings(year);

      switch (res.type) {
        case 'error':
          console.log(res.message);
          setStatus('error');
          return;
        case 'success':
          console.log('Rankings loaded successfuly');
          addRankings(parseInt(year), res.rankings);
          data = res.rankings;
          break;
        default:
          break;
      }
    } else {
      console.log('Rankings loaded from redux store');
    }

    setStatus('loaded');
  };

  return (
    <Container fluid className='content-1' style={{ padding: 0, margin: 0 }}>
      <Navbar bg="light" variant='light' sticky='top'>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-primary">Search</Button>
    </Form>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    addRankings: (year, data) => dispatch(AddRankings(year, data)),
    addRanking: (year, data) => dispatch(AddRanking(year, data))
  };
};

export default connect(mapStateToProps)(Rankings);
