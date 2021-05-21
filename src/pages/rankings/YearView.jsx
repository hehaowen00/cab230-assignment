import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingAlert from '../../components/LoadingAlert';

import { AddRankings } from '../../redux/actions/Data';
import { fetchRankings } from '../../utils/dataFunctions';

function YearView({ rankings, year, addRankings }) {
  const [status, setStatus] = useState('loading');
  const [yearData, setYearData] = useState([]);

  async function onLoad() {
    let data = undefined;

    if (year in rankings && rankings[year]) {
      console.log(`loaded rankings for ${year} from redux store`);
      data = rankings[year];
    } else {
      let resp = await fetchRankings({year});
      const { type } = resp;

      if (type === 'success') {
        data = resp.data;
        addRankings(year, data);
      }

      if (type === 'error') {
        setStatus('error');
        return;
      }
    }

    setYearData(data);
    setStatus('loaded');
  };

  useEffect(() => {
    if (Number(year) !== Number.NaN) {
      onLoad();
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

function mapDispatchToProps(dispatch) {
  return {
    addRankings: (year, rankings) => dispatch(AddRankings(year, rankings))
  };
};

function mapStateToProps(state) {
  const { data } = state;
  return {
    rankings: data.rankings
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(YearView);

