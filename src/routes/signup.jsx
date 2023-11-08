import {Row, Col, Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import NavbarSample from '../components/Navbar'; 
import { useState } from 'react';
import { createNewUser } from '../api/lnbits';
import { checkUniqueUser, insertSanity, userSchema } from '../api/db';
import { isStrong } from '../helpers/security';

const Signup = () => {
   const [formData, setFormData] = useState({
    user: '',
    name: '',
    password1: '',
    password2: ''
   })
   const [alert, setAlert] = useState(<></>);

   const handleChangeForm = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        })
   }

   const handleSubmit = async (e) => {
        e.preventDefault();

        let responsePassword = isStrong(formData.password1);

        //verifies all the fields have been filled
        if (formData.name == '' || formData.user == '' || formData.password1 == '' || formData.password2 == '') {
            setAlert(<Alert key='danger' variant='danger'>
            Please fill out all the fields
          </Alert>)
          return;
        } 

        //verifies passwords match
        if (formData.password1 != formData.password2) {
            setAlert(<Alert key='danger' variant='danger'>
            Passwords don't match
          </Alert>)
          return;
        } 
        
        //verifies password is secure
        if (!responsePassword.isSafe) {
            setAlert(<Alert key='danger' variant='danger'>
                    {responsePassword.message}
                  </Alert>)
            return;
        }

        setAlert(<Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>)

        //verifies there's no other user already registered under the same user.
        let checkUser = await checkUniqueUser(formData.user);
        if (checkUser) {
            setAlert(<Alert key='danger' variant='danger'>
                        User already exists, try another one!
                    </Alert>)
            return;
        }

        //signs up
        let response = await createNewUser(formData.user, formData.name);
        let user = await userSchema(formData.user, formData.name, formData.password1, response.inkey, response.id, response.adminkey, response.user, response.lnurlp);
        let db_response = await insertSanity(user);

        if (!response) {
            setAlert(<Alert key='danger' variant='danger'>
                There was an error while signing up on lnbits
              </Alert>)

            return;
        }

        if (!db_response) {
            setAlert(<Alert key='danger' variant='danger'>
                There was an error while signing up on sanity
                </Alert>)
            return;
        }

        setAlert(<Alert key='success' variant='success'>
            Store registered successfully!
        </Alert>)

        setFormData({
            user: '',
            name: '',
            password1: '',
            password2: ''
           });
    }


    return (<>
        <NavbarSample />
            <Container >
            <br />
                    <div className="text-center">
                        <h2>Register my store!</h2>
                    </div>
                    <br />
                    <Row className="justify-content-md-center">
                        <Col md={6}>
                            {alert}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formUser" className="mb-3">
                                    <Form.Label>User</Form.Label>
                                    <Form.Control value={formData.user} onChange={handleChangeForm} name="user" type="text" placeholder="Satoshi Nakamoto" />
                                </Form.Group>
                                <Form.Group controlId="formName" className="mb-3">
                                    <Form.Label>Store name</Form.Label>
                                    <Form.Control value={formData.name} onChange={handleChangeForm} name="name" type="text" placeholder="Satoshi Nakamoto" />
                                </Form.Group>
                                <Form.Group controlId="formPassword1" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control value={formData.password1} onChange={handleChangeForm} name="password1" type="password" placeholder="Some password" />
                                </Form.Group>
                                <Form.Group controlId="formPassword2" className="mb-3">
                                    <Form.Label>Confirmation</Form.Label>
                                    <Form.Control value={formData.password2} onChange={handleChangeForm} name="password2" type="password" placeholder="Confirm password" />
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