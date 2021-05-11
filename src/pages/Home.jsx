import React, { Fragment, useEffect, useState } from 'react';
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
        data = resp.rankings;
        addRankings(year, data);
      }
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
              <div className='input-group sm-5'>
                <span className='input-group-text'>Year</span>
                <Form.Control as='select' onChange={e => updateYear(e)}>
                  {years.map((year, idx) => <option key={idx} selected={year === lastYear}>{year}</option>)}
                </Form.Control>
              </div>
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

