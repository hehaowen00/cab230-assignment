import React from 'react';

const SelectElement = ({ text, value, onChange, style, children }) => {
  return (
    <div className='input-group menu-element' style={style}>
      <span className='input-group-text'>{text}</span>
      <select className='form-select select' onChange={onChange} value={value}>
        {children}
      </select>
    </div>
  );
}

export default SelectElement;
