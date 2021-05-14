import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { deleteJWT } from '../utils/jwt';

function Logout({ authenticated, logout }) {
  const load = () => {
    deleteJWT()
    logout();
  };

  useEffect(() => {
    load();
  });

  return (
    <Redirect to='/' />
  );
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch({ type: 'userLogout' })
  };
};

const mapStateToProps = state => {
  let { user } = state;
  return {
    authenticated: user.authenticated,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
