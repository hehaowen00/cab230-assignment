import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Container, Row, Button, InputGroup, Form, Navbar } from 'react-bootstrap-v5';
import CountrySelect from '../components/CountrySelect';
import SelectElement from '../components/SelectElement';
import YearTable from './factors/YearTable';
import CountryView from './factors/CountryView';

function Factors({ authenticated, data, session, dispatch }) {
  const { countries, years } = data;
  const { view, year, limit, country, range, once } = session;
  const { setView, setYear, setLimit, setCountry, setRange, setOnce } = dispatch;

  const [run, setRun] = useState(false);
  const history = useHistory();

  let maximum = countries.length;
  const placeholder = `(max ${maximum})`;

  const inline = f => e => f(e.target.value);
  const handleSelect = handler => inline(
    value => handler(value === 'Select' ? undefined : value))

  const setYears = idx => handleSelect(v => {
    let temp = range;
    temp[idx] = v;
    setRange(temp);
  });

  const onClick = () => {
    setRun(true);
    setTimeout(() => setRun(false), 1000);
    setOnce(true);
  };

  const onViewChange = v => {
    if (v === 'Country') {
      onClick();
    }
    console.log(v);
    setView(v);
  }

  const checkLimit = (value) => {
    if (Number(value) === Number.NaN) {
      return;
    }

    if (Number(value) > maximum) {
      setLimit(maximum.toString());
    } else {
      setLimit(value);
    }
  };

  useEffect(() => {
    if (!authenticated) {
      history.push('/login');
    } else if (once) {
      onClick();
    }
  }, [authenticated]);

  const onSubmit = e => e.preventDefault();

  return (
    <Container fluid className='content-1' style={{ padding: 0, margin: 0 }}>
      <Navbar bg='light' variant='light' sticky='top'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Form className='d-flex form-inline' onSubmit={onSubmit}>
            <SelectElement text='Get' onChange={inline(onViewChange)}
              style={styles.spaced} value={view}>
              <option key={1}>Country</option>
              <option key={2}>Year</option>
            </SelectElement>
            {view === 'Country' &&
              <Fragment>
                <CountrySelect current={country} onSelect={setCountry} />
                <RangeSelect range={range} years={years} setRange={setYears} />
              </Fragment>
            }
            {view === 'Year' &&
              <Fragment>
                <SelectElement
                  text='Year' value={year}
                  onChange={handleSelect(setYear)}
                  style={styles.spaced}>
                  <option key={0}></option>
                  {years.map((y, idx) => <option key={idx + 1}>{y}</option>)
                  }
                </SelectElement>
                <div className='input-group' style={styles.spaced}>
                  <span className='input-group-text'>Limit</span>
                  <input className='form-control' onChange={handleSelect(checkLimit)}
                    type='text' value={limit ? limit : ''}
                    placeholder={placeholder} />
                </div>
              </Fragment>
            }
            {view && <Button variant='primary' onClick={onClick}>Load</Button>}
          </Form>
        </Navbar.Collapse>
      </Navbar >
      <Row className='g-0' style={styles.contentRow}>
        {view === 'Year' && <YearTable run={run} year={year} limit={limit} />}
        {view === 'Country' && <CountryView run={run} country={country} range={range} />}
      </Row>
    </Container >
  );
}

function RangeSelect({ range, years, setRange }) {
  return (
    <Fragment>
      <SelectElement
        text='From' value={range[0]}
        onChange={setRange(0)}
        value={range[0]}
        style={styles.spaced}>
        <option key={0}></option>
        {years.map((y, idx) =>
          <option key={idx + 1}>{y}</option>)
        }
      </SelectElement>
      <SelectElement
        text='To' value={range[1]}
        onChange={setRange(1)}
        value={range[1]}
        style={styles.spaced}>
        <option key={0}></option>
        {years.map((y, idx) =>
          <option key={idx + 1}>{y}</option>)
        }
      </SelectElement>
    </Fragment>
  );
}

const styles = {
  contentRow: {
    height: 'calc(100% - 54px)',
    maxWidth: '100%',
    marginRight: '5px'
  },
  spaced: {
    marginRight: '5px'
  },
  select: { display: 'flex', minWidth: '200px', background: 'white', marginRight: '5px' }
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: {
      setView: view => dispatch({ type: 'factors', sub: 'view', payload: view }),
      setYear: year => dispatch({ type: 'factors', sub: 'year', payload: year }),
      setLimit: limit => dispatch({ type: 'factors', sub: 'limit', payload: limit }),
      setCountry: country => dispatch({ type: 'factors', sub: 'country', payload: country }),
      setRange: range => dispatch({ type: 'factors', sub: 'range', payload: range }),
      setOnce: once => dispatch({ type: 'factors', sub: 'once', payload: once })
    }
  };
};

const mapStateToProps = state => {
  const { data, user, factors } = state;
  return {
    authenticated: user.authenticated,
    data: {
      countries: data.countries,
      years: data.years
    },
    session: factors
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Factors);

