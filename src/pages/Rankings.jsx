import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Form, Navbar } from 'react-bootstrap-v5';

import SelectElement from '../components/SelectElement';
import YearView from './views/YearView';
import CountryView from './views/CountryView';

function Rankings({ countries, years }) {
  console.log(countries);
  const [plotType, setPlotType] = useState('rank');
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
            <SelectElement text='Get' onChange={updateType} style={styles.spaced}>
              <option key={0} selected={type == undefined}>Select</option>
              <option key={1}>Country</option>
              <option key={2}>Year</option>
            </SelectElement>
            {type === 'Country' &&
              <Fragment>
                <SelectElement text='Plot' onChange={e => setPlotType(e.target.value)} style={styles.spaced}>
                  <option key={1}>Rank</option>
                  <option key={2}>Score</option>
                </SelectElement>
                <SelectElement text='Country 1' value={country1} onChange={updateHandler(setCountry1)}
                  style={styles.spaced}>
                  <option key={0} selected={country1 == undefined}>Select</option>
                  {countries.map((country, idx) =>
                    <option key={idx + 1} selected={country1 === country}>{country}</option>)
                  }
                </SelectElement>
                <SelectElement text='Country 2' value={country2} onChange={updateHandler(setCountry2)}>
                  <option key={0} selected={country2 == undefined}>Select</option>
                  {countries.map((country, idx) =>
                    <option key={idx + 1} selected={country2 === country}>{country}</option>)
                  }
                </SelectElement>
              </Fragment>
            }
            {type === 'Year' &&
              <Fragment>
                <SelectElement
                  text='Year 1' value={year1} onChange={updateHandler(setYear1)}
                  style={styles.spaced}>
                  <option key={0} selected={year1 == undefined}>Select</option>
                  {years.map((year, idx) =>
                    <option key={idx + 1} value={year} selected={Number(year1) == year}>
                      {year}
                    </option>)
                  }
                </SelectElement>
                <SelectElement
                  text='Year 2' value={year2} onChange={updateHandler(setYear2)}
                  style={styles.spaced}>
                  <option key={0} selected={year2 == undefined}>Select</option>
                  {years.map((year, idx) =>
                    <option key={idx + 1} value={year} selected={Number(year2) == year}>
                      {year}
                    </option>)
                  }
                </SelectElement>
              </Fragment>
            }
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Row style={{ height: 'calc(100% - 54px)', maxWidth: '100%' }}>
        {type === 'Year' &&
          <ContentView>
            {year1 !== undefined && <YearView year={year1} />}
            {year2 !== undefined && <YearView year={year2} />}
          </ContentView>
        }
        {type === 'Country' &&
          <ContentView>
            {country1 !== undefined && <CountryView plot={plotType} country={country1} />}
            {country2 !== undefined && <CountryView plot={plotType} country={country2} />}
          </ContentView>
        }
      </Row>
    </Container >
  );
}

const ContentView = ({ children }) => {
  return (
    <Fragment>
      <Col style={{ height: '100%' }} >
        {children[0]}
      </Col>
      <Col className='float-right' style={{ height: '100%', padding: 0 }} >
        {children[1]}
      </Col>
    </Fragment>
  );
};

const styles = {
  spaced: {
    marginRight: '5px'
  }
};

const mapStateToProps = state => {
  let { data } = state;

  return {
    countries: data.countries,
    years: data.years
  };
};

export default connect(mapStateToProps)(Rankings);
