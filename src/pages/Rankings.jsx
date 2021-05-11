import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Form, Navbar } from 'react-bootstrap-v5';

import YearView from './views/YearView';

function Rankings({ countriesList, years }) {
  const sortedCountries = Array.from(countriesList).sort();

  const [type, setType] = useState('');
  const [year1, setYear1] = useState(undefined);
  const [year2, setYear2] = useState(undefined);
  const [country1, setCountry1] = useState(undefined);
  const [country2, setCountry2] = useState(undefined);

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
              <option key={1}>Country</option>
              <option key={2}>Year</option>
            </SelectElement>
            {type === 'Country' &&
              <Fragment>
                <SelectElement text='Country A' value={country1} onChange={updateHandler(setCountry1)}
                  style={styles.spaced}>
                  {sortedCountries.map((country, idx) =>
                    <option key={idx + 1} selected={country1 === country}>{country}</option>)}
                </SelectElement>
                <SelectElement text='Country B' value={country2} onChange={updateHandler(setCountry2)}>
                  {sortedCountries.map((country, idx) =>
                    <option key={idx + 1} selected={country2 === country}>{country}</option>)}
                </SelectElement>
              </Fragment>
            }
            {type === 'Year' &&
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
      {type === 'Year' &&
        <Fragment>
          <Row style={{ height: 'calc(100% - 54px)', minWidth: '100%' }}>
            <Col style={{ height: '100%' }} >
              {year1 !== undefined && <YearView year={year1} />}
            </Col>
            <Col className='float-right' style={{ height: '100%', padding: 0 }} >
              {year2 !== undefined && <YearView year={year2} />}
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
