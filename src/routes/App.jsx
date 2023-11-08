import { useState } from "react";
import NavbarSample from "../components/Navbar";
import { Container, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { verifyCredentials } from "../api/db";
import { verifyUser } from '../api/lnbits';
import { login } from '../helpers/credentials';

function App() {
    const [formData, setFormData] = useState({
        user: '',
        password: ''
    });
    const [alert, setAlert] = useState(<></>);
    

    const handleChangeForm = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setAlert(<Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>)

        const lnbitsCheck = await verifyUser(formData.user);
        if (!lnbitsCheck) {
            setAlert(<Alert key='danger' variant='danger'>
                    Wallet doesn't exist
                </Alert>)
            return;
        }


        const dbCheck = await verifyCredentials(formData.user, formData.password);
        if (!dbCheck) {
            setAlert(<Alert key='danger' variant='danger'>
                    Incorrect password
                </Alert>)
            return;
        }

        login(dbCheck._id, dbCheck.user_id, dbCheck.user, dbCheck.invoice_key, dbCheck.wallet_id, dbCheck.admin_key, dbCheck.lnurlp);
        window.location.href = '/'; 
    }


    return (
        <>
            <NavbarSample />
            <Container >
                <br />
                <div className="text-center">
                    <h2>Welcome to BitChange!</h2>
                </div>
                <br />
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <div className="text-center">
                            {alert}
                        </div>
                        <Form onSubmit={handleSubmit}>  
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your username</Form.Label>
                                <Form.Control value={formData.user} onChange={handleChangeForm} name="user" type="text" placeholder="Username" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your password</Form.Label>
                                <Form.Control value={formData.password} onChange={handleChangeForm} name="password" type="password" placeholder="your password account" />
                            </Form.Group>
                            <br />
                            <Col className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Log in
                                </Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;
