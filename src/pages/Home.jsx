import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Container, Row, Col, Alert, Form } from 'react-bootstrap-v5';
import { WorldMap } from 'react-svg-worldmap'

import { AddRankings } from '../redux/actions/Data';
import { fetchRankings, mapRankingsToMapData } from '../utils/functions';

function Home({ rankings, years, addRankings }) {
  const [mapData, setMapData] = useState([]);
  const [status, setStatus] = useState('loading');
  const lastYear = years[years.length - 1];

  const load = async (year) => {
    let data = rankings[year];

    if (!(year in rankings)) {
      let res = await fetchRankings(year);

      switch (res.type) {
        case 'error':
          console.log(res.message);
          setStatus('error');
          return;
        case 'success':
          console.log('Rankings loaded successfuly');
          addRankings(parseInt(year), res.rankings);
          data = res.rankings;
          break;
        default:
          break;
      }
    } else {
      console.log('Rankings loaded from redux store');
    }

    let { mapData } = mapRankingsToMapData(data);
    setMapData(mapData);
    setStatus('loaded');
  };

  const updateYear = (e) => {
    load(e.target.value.toString());
  };

  useEffect(() => {
    load(years[years.length - 1]);
  }, []);

  return (
    <Container fluid className='content-1'>
      <main className='flex-shrink-0'>
        <h4>World Happiness Rankings</h4>
        <p>Explore data from 2015 to 2020 on happiness in countries around the world</p>
        {status === 'loading' && <p>Loading data...</p>}
        {status === 'error' &&
          <Alert variant={'danger'}>
            Error: Unable to fetch data from server
          </Alert>
        }
        {status === 'loaded' &&
          <Fragment><Form>
            <Form.Group>
              <Form.Control as='select' onChange={e => updateYear(e)}>
                {years.map((year, idx) => <option key={idx} selected={year === lastYear}>{year}</option>)}
              </Form.Control>
            </Form.Group>
          </Form>
            <Row>
              <Col style={styles.mapContainer}>
                <WorldMap size='xxl' data={mapData} color='gold' />
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
    addRankings: (year, rankings) => dispatch(AddRankings(year, rankings))
  };
};

const mapStateToProps = state => {
  const { data } = state;
  return {
    rankings: data.rankings,
    years: data.years
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

