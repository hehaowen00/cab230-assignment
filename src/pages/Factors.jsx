import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Container, Col, Row, Button, Form, Navbar } from 'react-bootstrap-v5';
import SelectElement from '../components/SelectElement';

function Factors({ authenticated, countries, years }) {
  const history = useHistory();
  console.log(countries);

  const [type, setType] = useState(undefined);
  const [year, setYear] = useState(undefined);
  const [cYear, setCYear] = useState(undefined);
  const [cYear1, setCYear1] = useState(undefined);
  const [country, setCountry] = useState(undefined);
  const [limit, setLimit] = useState(undefined);


  let maximum = countries.length;
  const placeholder = `(max ${maximum})`;

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

  const onClick = (e) => {
    if (type === 'Country') {
    } else if (type === 'Year') {
    }
  };

  const checkLimit = (value) => {
    if (Number(value) > maximum) {
      setLimit(maximum.toString());
    } else {
      setLimit(value);
    }
  };

  useEffect(() => {
    if (!authenticated) {
      history.push('/login');
    }
  }, [authenticated]);

  return (
    <Container fluid className='content-1' style={{ padding: 0, margin: 0 }}>
      <Navbar bg='light' variant='light' sticky='top'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Form className='d-flex form-inline'>
            <SelectElement text='Get' onChange={updateHandler(setType)} style={styles.spaced}>
              <option key={0} selected={type == undefined}>Select</option>
              <option key={1}>Country</option>
              <option key={2}>Year</option>
            </SelectElement>
            {type === 'Country' &&
              <Fragment>
                <SelectElement text='Country' value={country} onChange={updateHandler(setCountry)}
                  style={styles.spaced}>
                  <option key={0} selected={country == undefined}>Select</option>
                  {countries.map((c, idx) =>
                    <option key={idx + 1} selected={country === c}>{c}</option>)
                  }
                </SelectElement>
              </Fragment>
            }
            {type !== undefined &&
              <SelectElement
                text={type === 'Country' ? 'From' : 'Year'} value={type === 'Country' ? cYear : year}
                onChange={updateHandler(type === 'Country' ? setCYear : setYear)}
                style={styles.spaced}>
                <option key={0} selected={type === 'Country' ? cYear : year === undefined}>Select</option>
                {years.map((y, idx) =>
                  <option key={idx + 1}
                    selected={Number(type === 'Country' ? cYear : year) == y}>
                    {y}
                  </option>)
                }
              </SelectElement>
            }
            {type === 'Country' &&
              <SelectElement
                text='To' value={cYear1}
                onChange={updateHandler(setCYear1)}
                style={styles.spaced}>
                <option key={0} selected={cYear1 === undefined}>Select</option>
                {years.map((y, idx) =>
                  <option key={idx + 1}
                    selected={Number(cYear1) == y}>
                    {y}
                  </option>)
                }
              </SelectElement>
            }
            {type === 'Year' &&
              <div className='input-group' style={styles.spaced}>
                <span className='input-group-text'>Limit</span>
                <input className='form-control' onChange={updateHandler(checkLimit)}
                  type='text' value={limit === undefined ? '' : limit}
                  placeholder={placeholder} />
              </div>
            }
            <Button variant='primary'>Load</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar >
      <Row style={{ height: 'calc(100% - 54px)', maxWidth: '100%' }}>
      </Row>
    </Container >
  );
}

const styles = {
  spaced: {
    marginRight: '5px'
  }
};

const mapStateToProps = state => {
  const { data, user } = state;
  return {
    authenticated: user.authenticated,
    countries: data.countries,
    years: data.years
  };
};

export default connect(mapStateToProps)(Factors);

