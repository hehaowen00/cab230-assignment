import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { deleteJWT } from '../utils/jwt';
import { LogoutAction } from '../redux/actions/User';

function Logout({ logout }) {
  useEffect(() => {
    deleteJWT()
    logout();
  });

  return (
    <Redirect to='/' />
  );
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(LogoutAction())
  };
};

function mapStateToProps() {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
