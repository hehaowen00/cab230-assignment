import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap-v5';

import { AddRankings } from '../../redux/actions/Data';
import { fetchRankings } from '../../utils/functions';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

function YearView({ rankings, year, addRankings }) {
  const [status, setStatus] = useState('loading');
  const [yearData, setYearData] = useState([]);

  const parseData = (data) => {
    return data.reduce((a, c) => [...a, { rank: Number(c.rank), score: Number(c.score), ...c }], []);
  };

  const load = async () => {
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

    setYearData(parseData(data));
    setStatus('loaded');
  };

  useEffect(() => {
    load();
  }, [year]);

  return (
    <AgGridReact className='ag-theme-alpine' pagination={true} paginationPageSize={25} rowData={parseData(yearData)} containerStyle={{ height: '100%' }} >
      <AgGridColumn field='rank' sortable={true}></AgGridColumn>
      <AgGridColumn field='country' filter={true} sortable={true}></AgGridColumn>
      <AgGridColumn field='score' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
    </AgGridReact>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    addRankings: (year, rankings) => dispatch(AddRankings(year, rankings))
  };
};

const mapStateToProps = state => {
  const { data } = state;
  return {
    rankings: data.rankings
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(YearView);
