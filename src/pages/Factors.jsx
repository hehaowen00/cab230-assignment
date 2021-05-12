import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Factors({ authenticated }) {
  const history = useHistory();

  if (!authenticated) {
    history.push('/login');
  }

  return (
    <div>
    </div>
  );
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    authenticated: user.authenticated
  };
};

export default connect(mapStateToProps)(Factors);

