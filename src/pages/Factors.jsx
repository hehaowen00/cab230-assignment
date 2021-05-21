import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Container, Form, Navbar, Row } from 'react-bootstrap-v5';
import CountrySelect from '../components/CountrySelect';
import SelectElement from '../components/SelectElement';
import CountryView from './factors/CountryView';
import TableView from './factors/TableView';

import {
  ViewAction,
  YearAction,
  LimitAction,
  CountryAction,
  RangeAction,
  OnceAction,
} from '../redux/actions/Factors';
import { RedirectAction } from '../redux/actions/User';

function Factors({ authenticated, data, session, dispatch }) {
  const { countries, years } = data;
  const { view, year, limit, country, range, once } = session;
  const { setView, setYear, setLimit, setCountry, setRange, setOnce, setRedirect } = dispatch;

  const [run, setRun] = useState(false);
  const history = useHistory();

  let maximum = countries.length;
  const placeholder = `(max ${maximum})`;

  const inline = f => e => f(e.target.value);
  const handleSelect = handler => inline(
    value => handler(value === 'Select' ? undefined : value))

  const onClick = useCallback(() => {
    setRun(true);
    setOnce(true);
  }, [setOnce])

  const onLoad = useCallback((authenticated) => {
    if (!authenticated) {
      setRedirect();
      history.push('/login');
    } else if (once) {
      onClick();
    }
  }, [history, once, onClick, setRedirect]);

  const setYears = idx => handleSelect(v => {
    let temp = range;
    temp[idx] = v;
    setRange(temp);
  });

  function onViewChange(v) {
    if (v === 'Country') {
      onClick();
    }
    setView(v);
  }

  function checkLimit(value) {
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
    onLoad(authenticated);
  }, [authenticated, onLoad]);

  const onSubmit = e => e.preventDefault();

  return (
    <Container fluid className='page-view'>
      <Navbar bg='light' variant='light' sticky='top'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Form className='d-flex form-inline' onSubmit={onSubmit}>
            <SelectElement text='Get' onChange={inline(onViewChange)} value={view}>
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
                <SelectElement text='Year' value={year} onChange={handleSelect(setYear)}>
                  <option key={0}>Select</option>
                  {years.map((y, idx) => <option key={idx + 1}>{y}</option>)}
                </SelectElement>
                <div className='input-group menu-element'>
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
      </Navbar>
      <Row className='content g-0'>
        {view === 'Country' &&
          <CountryView country={country} range={range} run={run} setRun={setRun} />
        }
        {view === 'Year' &&
          <TableView year={year} limit={limit} run={run} setRun={setRun} />
        }
      </Row>
    </Container>
  );
}

function RangeSelect({ range, years, setRange }) {
  return (
    <Fragment>
      <SelectElement text='From' value={range[0]} onChange={setRange(0)}>
        <option key={0}>Select</option>
        {years.map((y, idx) =>
          <option key={idx + 1}>{y}</option>)
        }
      </SelectElement>
      <SelectElement text='To' value={range[1]} onChange={setRange(1)}>
        <option key={0}>Select</option>
        {years.map((y, idx) =>
          <option key={idx + 1}>{y}</option>)
        }
      </SelectElement>
    </Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: {
      setView: view => dispatch(ViewAction(view)),
      setYear: year => dispatch(YearAction(year)),
      setLimit: limit => dispatch(LimitAction(limit)),
      setCountry: country => dispatch(CountryAction(country)),
      setRange: range => dispatch(RangeAction(range)),
      setOnce: once => dispatch(OnceAction(once)),
      setRedirect: () => dispatch(RedirectAction('/factors'))
    }
  };
};

function mapStateToProps(state) {
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

