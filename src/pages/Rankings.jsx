import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Form, Navbar } from 'react-bootstrap-v5';

import SelectElement from '../components/SelectElement';
import YearView from './rankings/YearView';
import CountryView from './rankings/CountryView';

function Rankings({ countries, years }) {
  const [plotType, setPlotType] = useState('Rank');
  const [view, setView] = useState(undefined);

  const [selection, setSelection] = useState({
    years: [undefined, undefined],
    countries: [undefined, undefined]
  });

  const setCountry = (idx) => {
    return (value) => {
      let countries = selection.countries;
      countries[idx] = value;
      setSelection({ ...selection, countries });
    }
  };

  const setYear = (idx) => {
    return (value) => {
      let years = selection.years;
      years[idx] = value;
      setSelection({ ...selection, years });
    }
  };

  const updatePlotType = e => {
    setView(e.target.value);
  };

  const wrapFn = handler => {
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
            <SelectElement text='Get' onChange={updatePlotType} style={styles.spaced}>
              <option key={0} selected={!view}>Select</option>
              <option key={1}>Country</option>
              <option key={2}>Year</option>
            </SelectElement>
            {view === 'Country' &&
              <Fragment>
                <SelectElement text='Plot' onChange={e => setPlotType(e.target.value)} style={styles.spaced}>
                  <option key={1}>Rank</option>
                  <option key={2}>Score</option>
                </SelectElement>
                {selection.countries.map((c, idx) =>
                  <SelectElement text={'Country ' + (idx + 1)} onChange={wrapFn(setCountry(idx))}>
                    <option key={0} selected={!c}>Select</option>
                    {countries.map((country, idx) =>
                      <option key={idx + 1} selected={c === country}>{country}</option>)
                    }
                  </SelectElement>)
                }
              </Fragment>
            }
            {view === 'Year' &&
              <Fragment>
                {selection.years.map((y, idx) =>
                  <SelectElement
                    text={'Year ' + (idx + 1)} onChange={wrapFn(setYear(idx))}
                    style={styles.spaced}>
                    <option key={0} selected={!y}>Select</option>
                    {years.map((year, idx) =>
                      <option key={idx + 1} value={year} selected={Number(y) == year}>
                        {year}
                      </option>)
                    }
                  </SelectElement>
                )}
              </Fragment>
            }
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Row style={{ height: 'calc(100% - 54px)', maxWidth: '100%' }}>
        {view === 'Year' &&
          <ContentView>
            {selection.years.map(year => <YearView year={year} />)}
          </ContentView>
        }
        {view === 'Country' &&
          <ContentView>
            {selection.countries.map(country => <CountryView plot={plotType} country={country} />)}
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
