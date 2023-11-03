import NavbarSample from "../components/Navbar";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

function App() {
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
                            {}
                        </div>
                        <Form >  
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your username</Form.Label>
                                <Form.Control name="privKey" type="text" placeholder="Username" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your password</Form.Label>
                                <Form.Control name="password" type="password" placeholder="your password account" />
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
