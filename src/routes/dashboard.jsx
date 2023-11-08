import { Row, Col, Container, Button, Alert, Card, Modal, Form, Spinner } from "react-bootstrap";
import NavbarSample from "../components/Navbar";
import { useState, useEffect } from "react";
import { getData } from "../helpers/credentials";
import { subscribeToWebSocket } from "../api/btcprice";
import { getBalance, createWithdraw } from '../api/lnbits';
import { changeSchema, insertSanity } from "../api/db";
import generateGuid from "../helpers/guid";

const Dashboard = () => {
    const credentials = getData();
    const [btcPrice, setBtcPrice] = useState(0);
    const [balance, setBalance] = useState(0);
    const [show, setShow] = useState(false);
    const [satsAmount, setSatsAmount] = useState(0);
    const [usdAmount, setUsdAmount] = useState(0);
    const [alert, setAlert] = useState(<></>);

    useEffect(() => {
        const fetchData = async () => {
            const balance = await getBalance(credentials.invoiceKey);
            setBalance(balance / 1000);
        }

        const unsubscribe = subscribeToWebSocket((price) => {
            setBtcPrice(price);
        });

        fetchData();
        return () => {
            unsubscribe();
        }
    }, [])


    const handleCreateVoucher = async (e) => {
        setAlert(<Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)
        
        if (satsAmount < 10) {
            setAlert(<Alert key='danger' variant='danger'>
                    sats amount must be 10 or more
                </Alert>)
        }

        const uid = generateGuid();

        const response = await createWithdraw(credentials.adminKey, uid, satsAmount);

        if (!response) {
            console.log(response);
            return;
        }
        
        console.log(credentials);
        const responseSanity = await insertSanity(changeSchema(uid, response.lnurl, response.open_time, satsAmount, usdAmount, credentials.sanityId));

        if (!responseSanity) {
            console.log(responseSanity);
            return;
        }

        window.location.href = '/voucher?uid=' + uid;
    }

    const handleSatsChange = (e) => {
        setSatsAmount(e.target.value);

        setUsdAmount((e.target.value * btcPrice  / 100000000).toFixed(2));
    }
    
    const handleUsdChange = (e) => {
        setUsdAmount(e.target.value);

        setSatsAmount(Math.round(e.target.value * 100000000 / btcPrice));
    }

    return (<>
        <NavbarSample />
        <Container>
            <br />
            <Row>
                <Col>
                    <Card>
                        <Card.Header><h5>Balance</h5>  <span>Current bitcoin price: ${btcPrice}</span></Card.Header>
                        <Card.Body>
                            <Card.Title>{balance != 0 ?  balance.toFixed(0) + ' SATS = $' + (balance * btcPrice / 100000000).toFixed(2) : 0} </Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Button onClick={btcPrice ? () => setShow(true) : () => setShow(false)}>Create voucher</Button>
                </Col>
            </Row>
        </Container>
        <Modal
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
            >
            <Modal.Header>
                <Modal.Title>Create a voucher</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alert}
                <Form as={Row}>
                    <Form.Group as={Col}>
                        <Form.Label>Amount of SATS</Form.Label>
                        <Form.Control type="number" value={satsAmount} onChange={handleSatsChange}></Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Amount of USD</Form.Label>
                        <Form.Control type="number" value={usdAmount} onChange={handleUsdChange}></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={handleCreateVoucher}>Create voucher</Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default Dashboard;