import React from 'react';
import { connect } from 'react-redux';
import { Fragment } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

function Sidebar({ authenticated, email }) {
  const footers = [
    <span>Signed in as {email}</span>,
    <Fragment>
      <NavItem path='/login' text='Login' />
      <NavItem path='/Register' text='Register' />
    </Fragment>
  ];

  const footer = authenticated ? footers[0] : footers[1];

  return (
    <div className='d-flex flex-column p-3 bg-light min-vh-100' style={styles.sidebar}>
      <a href='/' className='d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none'>
        <span className='fs-4'>World Happiness</span>
      </a>
      <hr />
      <ul className='nav nav-pills flex-column mb-auto'>
        <NavItem path='/' text='Home' />
        <NavItem path='/rankings' text='Rankings' />
        {authenticated &&
          <NavItem path='/visualize' text='Visualize' />
        }
      </ul>
      <ul className='nav nav-pills flex-row'>
        <NavItem path='/about' text='About Us' />
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
        <Button variant='link' className='nav-link text-left'>{text}</Button>
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
