import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap-v5';
import { LinkContainer } from 'react-router-bootstrap';

function Navigation() {
  return (
    <Navbar bg='light' expand='lg' variant='light'>
      <LinkContainer to='/'>
        <Navbar.Brand>Data Vis</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls='navbar' />
      <Navbar.Collapse id='navbar'>
        <Nav className='mr-auto'>
          <LinkContainer to='/'>
            <Nav.Link>Rankings</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/visualize'>
            <Nav.Link>Visualize</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav className='ml-auto'>
          <NavDropdown title='Account' id='basic-nav-dropdown'>
            <LinkContainer to='/login'>
              <NavDropdown.Item>Login</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to='/register'>
              <NavDropdown.Item >Register</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;