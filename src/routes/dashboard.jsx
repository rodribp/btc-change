import { Row, Col, Container, Button, Alert, Card, Modal, Form, Spinner } from "react-bootstrap";
import NavbarSample from "../components/Navbar";
import { useState, useEffect } from "react";
import { getData } from "../helpers/credentials";
import { subscribeToWebSocket } from "../api/btcprice";
import { getBalance, createWithdraw, getVouchers } from '../api/lnbits';
import { changeSchema, insertSanity } from "../api/db";
import generateGuid from "../helpers/guid";
import VoucherRapid from "./voucher";

const Dashboard = () => {
    const credentials = getData();
    const [btcPrice, setBtcPrice] = useState(0);
    const [balance, setBalance] = useState(0);
    const [satsAmount, setSatsAmount] = useState(0);
    const [usdAmount, setUsdAmount] = useState(0);
    const [alert, setAlert] = useState(<></>);
    const [preview, setPreview] = useState(<></>);
    const [debt, setDebt] = useState(0);

    const listVouchers = async () => {
        const vouchersList = await getVouchers(credentials.invoiceKey);

        let debt = 0;
        vouchersList.map((voucher) => {
            if (!voucher.used) {
                debt += voucher.max_withdrawable
            }
        });

        setDebt(debt);
    }

    useEffect(() => {

        const fetchData = async () => {
            const balance = await getBalance(credentials.invoiceKey);
            setBalance(balance / 1000);
        }

        const unsubscribe = subscribeToWebSocket((price) => {
            setBtcPrice(price);
        });

        fetchData();
        
        listVouchers();
        return () => {
            unsubscribe();
        }


    }, []);


    const handleCreateVoucher = async (e) => {

        if (!btcPrice) {
            return;
        }
        
        setPreview(<VoucherRapid uid="spinner"></VoucherRapid>);

        if (satsAmount < 10) {
            setAlert(<Alert key='danger' variant='danger'>
                    sats amount must be 10 or more
                </Alert>)
            setPreview(<></>);
                return;
        }

        const uid = generateGuid();

        if (satsAmount > balance - 25) {
            setAlert(<Alert key='danger' variant='danger'>
                    You don't have enough funds
                </Alert>)
            setPreview(<></>);
            
            return;
        }

        if ( satsAmount > balance - 25 - debt) {
            setAlert(<Alert key='danger' variant='danger'>
                    You have more sats in debt than in balance
                </Alert>)
            setPreview(<></>);
            
            return;
        }

        const response = await createWithdraw(credentials.adminKey, uid, satsAmount);

        if (!response) {
            console.log(response);
            return;
        }
        
        const responseSanity = await insertSanity(changeSchema(uid, response.lnurl, response.open_time, satsAmount, usdAmount, credentials.sanityId));

        if (!responseSanity) {
            console.log(responseSanity);
            return;
        }

        setAlert(<></>);

        listVouchers();
        setPreview(<VoucherRapid uid={uid}></VoucherRapid>);
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
                <Col lg={3}>
                    <Card>
                        <Card.Header><h5>Balance</h5>  <span>Current bitcoin price: ${btcPrice}</span></Card.Header>
                        <Card.Body>
                            <Card.Title>{balance != 0 ?  balance.toFixed(0) + ' SATS = $' + (balance * btcPrice / 100000000).toFixed(2) : 0} </Card.Title>
                        </Card.Body>
                    </Card>
                    
                <br />
                </Col>
                <Col lg={9}>
                    <Card>
                        <Card.Header className="flex">
                            <h5>New voucher</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form as={Row}>
                                {alert}
                                <Form.Group as={Col} sm={12} md={5}>
                                    <Form.Label>Amount of SATS</Form.Label>
                                    <Form.Control type="number" value={satsAmount} onChange={handleSatsChange}></Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} sm={12} md={5}>
                                    <Form.Label>Amount of USD</Form.Label>
                                    <Form.Control type="number" value={usdAmount} onChange={handleUsdChange}></Form.Control>
                                </Form.Group>
                            </Form>
                            <br />
                            <Button variant="primary" onClick={handleCreateVoucher}>Create voucher</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    {preview}
                </Col>
            </Row>
        </Container>
    </>)
}

export default Dashboard;