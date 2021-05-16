import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Col, Container, Row, Form } from 'react-bootstrap-v5';
import { WorldMap } from 'react-svg-worldmap'

import ErrorAlert from '../components/ErrorAlert';
import LoadingAlert from '../components/LoadingAlert';

import { AddRankings } from '../redux/actions/Data';
import { SetYearAction } from '../redux/actions/Home';
import { fetchRankings, mapRankingsToMapData } from '../utils/functions';

function Home({ data, session, dispatch }) {
  const { rankings, years } = data;
  const { addRankings, setYear } = dispatch;

  const [mapData, setMapData] = useState([]);
  const [status, setStatus] = useState('loading');

  const loadYear = async (year) => {
    let data = undefined;

    if (year in rankings) {
      console.log(`loaded rankings for ${year} from redux store`);
      data = rankings[year];
    } else {
      let resp = await fetchRankings(year);
      const { type } = resp;

      if (type === 'error') {
        setStatus('error');
        return;
      }

      if (type === 'success') {
        data = resp.data;
        addRankings(year, data);
      }
    }

    let { mapData } = mapRankingsToMapData(data);

    setMapData(mapData);
    setStatus('loaded');
  };

  const updateYear = (e) => {
    setYear(e.target.value.toString());
  };

  useEffect(() => {
    let { year } = session;
    loadYear(year);
  }, [session]);

  const onSubmit = e => e.preventDefault();

  const onHover = (name, code, value, prefix, sufix) => {
    return `${name}\n[Score: ${value}]`;
  };

  return (
    <Container fluid className='content-1'>
      <main className='flex-shrink-0'>
        <h4>World Happiness Rankings</h4>
        <p>Explore data from 2015 to 2020 on happiness in countries around the world</p>
        {status === 'loading' && <LoadingAlert />}
        {status === 'error' && <ErrorAlert />}
        {status === 'loaded' &&
          <Fragment>
            <Form onSubmit={onSubmit}>
              <Form.Group>
                <div className='input-group sm-5'>
                  <span className='input-group-text'>Year</span>
                  <Form.Control as='select' onChange={e => updateYear(e)}>
                    {years.map((year, idx) =>
                      <option key={idx} selected={year === Number(session.year)}>
                        {year}
                      </option>)
                    }
                  </Form.Control>
                </div>
              </Form.Group>
            </Form>
            <Row>
              <Col style={styles.mapContainer}>
                <WorldMap size='xxl' data={mapData} color='gold' tooltipTextFunction={onHover} />
              </Col>
            </Row>
          </Fragment>}
      </main >
    </Container >
  );
}

const styles = {
  mapContainer: {
    maxWidth: '100%',
    maxHeight: '84vh',
    overflowY: 'auto',
    paddingLeft: '80px',
  }
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: {
      addRankings: (year, rankings) => dispatch(AddRankings(year, rankings)),
      setYear: year => dispatch(SetYearAction(year))
    }
  };
};

const mapStateToProps = state => {
  const { data, home } = state;
  return {
    data: {
      rankings: data.rankings,
      years: data.years,
    },
    session: home
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

