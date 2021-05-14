import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap-v5';

function Sidebar({ authenticated }) {
  const [footer, setFooter] = useState(undefined);

  const footers = [
    <NavItem path='/logout' text='Log Out' />,
    <Fragment>
      <NavItem path='/login' text='Login' />
      <NavItem path='/Register' text='Register' />
    </Fragment>
  ];

  useEffect(() => {
    setFooter(authenticated ? footers[0] : footers[1]);
  }, [authenticated]);

  return (
    <div className='d-flex flex-column p-3 bg-light min-vh-100' style={styles.sidebar}>
      <LinkContainer exact to='/home'>
      <a className='d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none'>
        <span className='fs-4'>World Happiness</span>
      </a>
      </LinkContainer>
      <hr />
      <ul className='nav nav-pills flex-column mb-auto'>
        <NavItem path='/rankings' text='Rankings' />
        {authenticated &&
          <Fragment>
            <NavItem path='/factors' text='Factors' />
          </Fragment>
        }
      </ul>
      <hr />
      <ul className='nav nav-pills flex-row'>
        {footer}
      </ul>
    </div >
  );
}

function NavItem({ path, text }) {
  return (
    <li className='nav-item'>
      <LinkContainer exact to={path} activeClassName='active'>
        <Button variant='link' className='nav-link text-start'>{text}</Button>
      </LinkContainer>
    </li>
  );
}

const styles = {
  sidebar: {
    width: '280px',
    maxWidth: '280px',
  }
};

const mapStateToProps = state => {
  const { user } = state;
  return {
    authenticated: user.authenticated,
    email: user.email
  }
}

export default connect(mapStateToProps)(Sidebar);
