import React from 'react';
import SelectElement from './SelectElement';
import { connect} from 'react-redux';

function YearSelect({years, text, value, onChange }) {
  const h = f => e => f(e.target.value);
  return (
    <SelectElement text={text} onChange={h(onChange)} value={value}>
      <option key={0}>Select</option>
      {years.map((year, idx) =>
        <option key={idx + 1} value={year}>{year}</option>)
      }
    </SelectElement>
  );
}

function mapStateToProps(state) {
  const { years } = state.data;
  return { years };
}

export default connect(mapStateToProps)(YearSelect);
