import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, Form, Navbar } from 'react-bootstrap-v5';

import CountrySelect from '../components/CountrySelect';
import SelectElement from '../components/SelectElement';
import YearView from './rankings/YearView';
import CountryView from './rankings/CountryView';

function Rankings({ data, session, dispatch }) {
  const { years } = data;
  const { view, plot } = session;
  const { setView, setPlotType, setCountries, setYears } = dispatch;

  const setCountry = (idx) => {
    return (value) => {
      let countries = session.countries;
      countries[idx] = value;
      setCountries(countries);
    }
  };

  const setYear = idx => value => {
    let years = session.years;
    years[idx] = value;
    setYears(years);
  };

  const inline = f => e => f(e.target.value);
  const onSubmit = e => e.preventDefault();

  return (
    <Container fluid className='content-1' style={{ padding: 0, margin: 0 }}>
      <Navbar bg='light' variant='light' sticky='top'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Form className='d-flex form-inline' onSubmit={onSubmit}>
            <SelectElement text='Get' onChange={inline(setView)} style={styles.spaced} value={view}>
              <option key={0}>Country</option>
              <option key={1}>Year</option>
            </SelectElement>
            {view === 'Country' &&
              <Fragment>
                <SelectElement text='Plot' onChange={inline(setPlotType)} style={styles.spaced}>
                  <option key={0}>Rank</option>
                  <option key={1}>Score</option>
                </SelectElement>
                {session.countries.map((c, idx) =>
                  <CountrySelect current={c} placeholder={'Country ' + (idx + 1)}
                    onSelect={setCountry(idx)} />)
                }
              </Fragment>
            }
            {view === 'Year' &&
              <Fragment>
                {session.years.map((y, idx) =>
                  <SelectElement
                    text={'Year ' + (idx + 1)} onChange={inline(setYear(idx))}
                    style={styles.spaced} value={y}>
                    <option key={0}>Select</option>
                    {years.map((year, idx) =>
                      <option key={idx + 1} value={year}>{year}</option>)
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
            {session.years.map(year => <YearView year={year} />)}
          </ContentView>
        }
        {view === 'Country' &&
          <ContentView>
            {session.countries.map(country => <CountryView plot={plot} country={country} />)}
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
    minWidth: '200px',
    marginRight: '5px'
  }
};

const mapDispatchToProps = dispatch => {
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

const mapStateToProps = state => {
  let { data, rankings } = state;

  return {
    data: {
      years: data.years,
    },
    session: rankings
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rankings);
