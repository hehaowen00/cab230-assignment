import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Col, Container, Row, Form } from 'react-bootstrap-v5';
import { WorldMap } from 'react-svg-worldmap'

import ErrorAlert from '../components/ErrorAlert';
import YearSelect from '../components/YearSelect';
import LoadingAlert from '../components/LoadingAlert';

import { AddRankings } from '../redux/actions/Data';
import { SetYearAction } from '../redux/actions/Home';
import { fetchRankings, mapRankingsToCountries } from '../utils/dataFunctions';

function Home({ data, session, dispatch }) {
  const { rankings} = data;
  const { addRankings, setYear } = dispatch;

  const [mapData, setMapData] = useState([]);
  const [status, setStatus] = useState('loading');

  const onLoad = useCallback(async (year) => {
    let data = undefined;

    if (year in rankings && rankings[year] !== undefined) {
      console.log(`loaded rankings for ${year} from redux store`);
      data = rankings[year];
    } else {
      let resp = await fetchRankings({year});
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

    let { mapData } = mapRankingsToCountries(data);
    setMapData(mapData);
    setStatus('loaded');
  }, [addRankings, setStatus, setMapData, rankings]);

  useEffect(() => {
    let { year } = session;
    onLoad(year);
  }, [onLoad, session]);

  const onSubmit = e => e.preventDefault();

  const onHover = (name, code, value, prefix, sufix) => {
    return `${name} [Score: ${value}]`;
  };

  return (
    <Container fluid className='home-view page-view'>
      <main className='flex-shrink-0 padded'>
        <h4>World Happiness Rankings</h4>
        <p>Explore data from 2015 to 2020 on happiness in countries around the world</p>
        {status === 'loading' && <LoadingAlert />}
        {status === 'error' && <ErrorAlert />}
        {status === 'loaded' &&
          <Fragment>
            <Form onSubmit={onSubmit}>
              <Form.Group>
                <div className='input-group sm-5'>
                  <YearSelect text='Year' onChange={setYear} value={session.year} />
                </div>
              </Form.Group>
            </Form>
            <Row>
              <Col className='map-view'>
                <WorldMap size='xxl' data={mapData} color='gold' tooltipTextFunction={onHover} />
              </Col>
            </Row>
          </Fragment>}
      </main>
    </Container>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: {
      addRankings: (year, rankings) => dispatch(AddRankings(year, rankings)),
      setYear: year => dispatch(SetYearAction(year))
    }
  };
};

function mapStateToProps(state) {
  const { data, home } = state;
  return {
    data: {
      rankings: data.rankings,
    },
    session: home
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

