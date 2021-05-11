import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Alert, Col, Row, Form, Navbar } from 'react-bootstrap-v5';


import YearView from './views/YearView';
import Country from './views/Country';

import { AddRanking, AddRankings } from '../redux/actions/Data';
import { fetchRankings } from '../utils/functions';

function Rankings({ countriesList, years }) {
  const [year1, setYear1] = useState(undefined);
  const [year2, setYear2] = useState(undefined);
  const [type, setType] = useState('');

  const sortedCountries = Array.from(countriesList).sort();

  const updateType = e => {
    let value = e.target.value;
    setType(value);
  };

  const updateHandler = handler => {
    return (e) => {
      let { value } = e.target;
      if (value === 'Select') {
        handler(undefined);
        return;
      }

      handler(value);
    };
  };

  return (
    <Container fluid className='content-1' style={{ padding: 0, margin: 0 }}>
      <Navbar bg='light' variant='light' sticky='top'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Form className='d-flex form-inline'>
            <SelectElement text='Filter By' onChange={updateType} style={styles.spaced}>
              <option key={1} value='country'>Country</option>
              <option key={2} value='year'>Year</option>
            </SelectElement>
            {type === 'year' &&
              <Fragment>
                <SelectElement
                  text='Year 1' value={year1} onChange={updateHandler(setYear1)}
                  style={styles.spaced}>
                  {years.map((year, idx) =>
                    <option
                      key={idx + 1}
                      value={year}
                      selected={Number(year1) === year}>
                      {year}
                    </option>)}
                </SelectElement>
                <SelectElement
                  text='Year 2' value={year2} onChange={updateHandler(setYear2)}
                  style={styles.spaced}>
                  {years.map((year, idx) =>
                    <option
                      key={idx + 1}
                      value={year}
                      selected={Number(year2) == year}>
                      {year}
                    </option>)}
                </SelectElement>
              </Fragment>
            }
          </Form>
        </Navbar.Collapse>
      </Navbar>
      {type === 'year' &&
        <Fragment>
          <Row style={{ height: 'calc(100% - 54px)', minWidth: '100%' }}>
            <Col style={{ height: '100%' }} >
              {type === 'year' && year1 !== undefined && <YearView year={year1} />}
            </Col>
            <Col className='float-right' style={{ height: '100%', padding: 0 }} >
              {type === 'year' && year2 !== undefined && <YearView year={year2} />}
            </Col>
          </Row>
        </Fragment>
      }
    </Container>
  );
}

const SelectElement = ({ text, value, onChange, style, children }) => {
  return (
    <div className='input-group sm-5' style={style}>
      <span className='input-group-text'>{text}</span>
      <select className='form-select select' onChange={onChange}>
        <option key={0} selected={value == undefined}>Select</option>
        {children}
      </select>
    </div>
  );
}

const styles = {
  spaced: {
    marginRight: '5px'
  }
};

const mapStateToProps = state => {
  let { data } = state;
  return {
    countriesList: data.countries,
    years: data.years
  };
};

export default connect(mapStateToProps)(Rankings);
