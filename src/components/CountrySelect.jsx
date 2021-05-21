import React  from 'react';
import { connect } from 'react-redux';
import ComboBox from 'react-responsive-combo-box'
import 'react-responsive-combo-box/dist/index.css'

function CountrySelect({ countries, current, placeholder, onSelect }) {
  const inline = f => e => f(e.target.value);

  function isValid(value) {
    if (countries.includes(value)) {
      onSelect(value);
    }
  };

  return (
    <ComboBox options={countries}
      style={style} defaultValue={current}
      placeholder={placeholder ? placeholder : 'Country'} enableAutocomplete
      onSelect={onSelect} onChange={inline(isValid)} />
  );
};

const style = {
  display: 'flex',
  minWidth: '200px',
  background: 'white',
  marginRight: '5px'
};

function mapStateToProps(state) {
  let countries = state.data.countries;
  return { countries };
};

export default connect(mapStateToProps)(CountrySelect);
