import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

function Sidebar() {
  return (
    <div className='d-flex flex-column p-3 bg-light min-vh-100' style={styles.sidebar}>
      <a href="/" className='d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none'>
        <span className='fs-4'>World Happiness</span>
      </a>
      <hr />
      <ul className='nav nav-pills flex-column mb-auto'>
        <NavItem path='/' text='Home' />
        <NavItem path='/rankings' text='Rankings' />
        <NavItem path='/visualize' text='Visualize' />
      </ul>
      <hr />
      <ul className='nav nav-pills flex-row'>
        <NavItem path='/login' text='Login' />
        <NavItem path='/Register' text='Register' />
      </ul>
    </div >
  );
}

function NavItem({ path, text }) {
  return (
    <li className='nav-item'>
      <LinkContainer exact to={path} activeClassName='active'>
        <a className='nav-link'>{text}</a>
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

export default Sidebar;
