import React from 'react';

const SelectElement = ({ text, onChange, style, children }) => {
  return (
    <div className='input-group sm-5' style={style}>
      <span className='input-group-text'>{text}</span>
      <select className='form-select select' onChange={onChange}>
        {children}
      </select>
    </div>
  );
}

export default SelectElement;
