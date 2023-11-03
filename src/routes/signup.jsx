import {Row, Col, Container, Form, Button} from 'react-bootstrap';
import NavbarSample from '../components/Navbar'; 

const Signup = () => {
    return (<>
        <NavbarSample />
            <Container >
            <br />
                    <div className="text-center">
                        <h2>Register my store</h2>
                    </div>
                    <br />
                    <Row className="justify-content-md-center">
                        <Col md={6}>
                            {alert}
                            <Form>
                                <Form.Group controlId="formName" className="mb-3">
                                    <Form.Label>User's name</Form.Label>
                                    <Form.Control name="name" type="text" placeholder="Satoshi Nakamoto" />
                                </Form.Group>
                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name="password1" type="password" placeholder="Some password" />
                                </Form.Group>
                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Confirmation</Form.Label>
                                    <Form.Control name="password2" type="password" placeholder="Confirm password" />
                                </Form.Group>
                                <br />
                                <Col className="d-grid gap-2">
                                    <Button variant="primary" type="submit">
                                        Create account
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
            </Container>
    </>);
}

export default Signup;