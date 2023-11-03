import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from '../assets/img/logo-simple.png'
import { useState } from 'react';
import { AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai';

const NavbarSample = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [elements, setElements] = useState(
        <Navbar.Collapse className="justify-content-end">
                <Nav>
                    {window.location.pathname == '/signup' ? <Nav.Link href='/'>login <AiOutlineLogin /></Nav.Link> : <Nav.Link href='/signup'>signup <AiOutlineUserAdd /></Nav.Link>}
                </Nav>
        </Navbar.Collapse>
    )

    if (isLogged) {

    }

    return (
        <Navbar className="bg-body-tertiary" bg='dark' data-bs-theme="dark">
        <Container>
            <Navbar.Brand href="#home">
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