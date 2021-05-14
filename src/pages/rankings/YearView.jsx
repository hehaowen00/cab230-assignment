import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { AddRankings } from '../../redux/actions/Data'; import { fetchRankings } from '../../utils/functions';

import { Alert } from 'react-bootstrap-v5';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';

function YearView({ rankings, year, addRankings }) {
  const [status, setStatus] = useState('loading');
  const [yearData, setYearData] = useState([]);

  const load = async () => {
    let data = undefined;

    if (year in rankings && rankings[year]) {
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

    setYearData(data);
    setStatus('loaded');
  };

  useEffect(() => {
    if (year) {
      load();
    }
  }, [year]);

  return (
    <Fragment>
      { year &&
        <Fragment>
          {status === 'loading' && <LoadingAlert />}
          {status === 'error' && <ErrorAlert />}
          {status === 'loaded' &&
            <AgGridReact className='ag-theme-alpine' pagination={true}
              paginationPageSize={25} rowData={yearData}
              containerStyle={{ height: '100%' }}>
              <AgGridColumn field='rank' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
              <AgGridColumn field='country' filter={true} sortable={true}></AgGridColumn>
              <AgGridColumn field='score' filter='agNumberColumnFilter' sortable={true}></AgGridColumn>
            </AgGridReact>
          }
        </Fragment>
      }
    </Fragment>
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
