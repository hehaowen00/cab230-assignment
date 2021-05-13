import React, { Fragment } from 'react';
import { FormControl } from 'react-bootstrap-v5';

function SearchSelect({ data, style, children, ...props }) {
  return (
    <Fragment>
      <FormControl type='text'>
      </FormControl>
      <div id='autocomplete'>
      </div>
    </Fragment>
  );
}

export default SearchSelect;
