import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, Form, Navbar } from 'react-bootstrap-v5';

import CountrySelect from '../components/CountrySelect';
import SelectElement from '../components/SelectElement';
import YearSelect from '../components/YearSelect';
import YearView from './rankings/YearView';
import CountryView from './rankings/CountryView';

function Rankings({ session, dispatch }) {
  const { view, plot } = session;
  const { setView, setPlotType, setCountries, setYears } = dispatch;

  const inline = f => e => f(e.target.value);
  const onSubmit = e => e.preventDefault();

  function setCountry(idx) {
    return (value) => {
      let countries = session.countries;
      countries[idx] = value;
      setCountries(countries);
    };
  };

  function setYear(idx) {
    return (value) => {
      let years = session.years;
      years[idx] = value;
      setYears(years);
    };
  }

  return (
    <Container fluid className='page-view'>
      <Navbar bg='light' variant='light' sticky='top'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Form className='d-flex form-inline' onSubmit={onSubmit}>
            <SelectElement text='Get' onChange={inline(setView)} value={view}>
              <option key={0}>Country</option>
              <option key={1}>Year</option>
            </SelectElement>
            {view === 'Country' &&
              <CountryMenu plot={plot} selection={session.countries} 
                onChange={inline(setPlotType)} onSelect={setCountry} />
            }
            {view === 'Year' &&
              <Fragment>
                {session.years.map((y, idx) =>
                  <YearSelect text={'Year ' + (idx + 1)} value={y}
                    onChange={setYear(idx)} />
                )}
              </Fragment>
            }
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Row className='content'>
        {view === 'Country' &&
          <ContentView>
            {session.countries.map((country, idx) =>
              <CountryView key={idx} plot={plot} country={country} />)
            }
          </ContentView>
        }
        {view === 'Year' &&
          <ContentView>
            {session.years.map(year =>
              <YearView year={year} />)
            }
          </ContentView>
        }
      </Row>
    </Container>
  );
}

function CountryMenu({plot, selection, onChange, onSelect}) {
  return (
    <Fragment>
      <SelectElement text='Plot' onChange={onChange} value={plot}>
        <option key={0}>Rank</option>
        <option key={1}>Score</option>
      </SelectElement>
      {selection.map((selected, idx) =>
        <CountrySelect key={idx} current={selected} placeholder={'Country ' + (idx + 1)}
          onSelect={onSelect(idx)} />)
      }
    </Fragment>
  );
}

function ContentView({ children }) {
  return (
    <Fragment>
      <Col className='left-view'>
        {children[0]}
      </Col>
      <Col className='right-view'>
        {children[1]}
      </Col>
    </Fragment>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch: {
      setView: view => dispatch(
        { type: 'rankings', sub: 'view', payload: view }),
      setPlotType: plot => dispatch(
        { type: 'rankings', sub: 'plot', payload: plot }),
      setCountries: countries => dispatch(
        { type: 'rankings', sub: 'countries', payload: countries }),
      setYears: years => dispatch(
        { type: 'rankings', sub: 'years', payload: years })
    }
  };
};

function mapStateToProps(state) {
  let { rankings } = state;

  return {
    session: rankings
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rankings);
