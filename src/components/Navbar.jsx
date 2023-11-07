import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from '../assets/img/logo-simple.png'
import { useState } from 'react';
import { AiOutlineLogin, AiOutlineUserAdd, AiOutlineLogout } from 'react-icons/ai';
import { getData, isLoggedIn, logOut } from '../helpers/credentials';

const NavbarSample = () => {
    const isLogged = isLoggedIn();

    const handleLogout = () => {
        logOut();
        window.location.href = '/';
    }

    var elements  = isLogged ? (
        <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <Nav.Link onClick={handleLogout}>logout <AiOutlineLogout /></Nav.Link>
                </Nav>
        </Navbar.Collapse>
    ) : (
        <Navbar.Collapse className="justify-content-end">
                <Nav>
                    {window.location.pathname == '/signup' ? <Nav.Link href='/'>login <AiOutlineLogin /></Nav.Link> : <Nav.Link href='/signup'>signup <AiOutlineUserAdd /></Nav.Link>}
                </Nav>
        </Navbar.Collapse>
    )


    return (
        <Navbar className="bg-body-tertiary" bg='dark' data-bs-theme="dark">
        <Container>
            <Navbar.Brand href="/">
                <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                />{' '}
                BitChange
            </Navbar.Brand>
            <Navbar.Toggle />
            {elements}
        </Container>
      </Navbar>
    )

}

export default NavbarSample;