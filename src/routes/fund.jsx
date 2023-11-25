import {Row, Col, Container, Card, Button, Form, InputGroup, OverlayTrigger, Tooltip, Alert} from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import NavbarSample from '../components/Navbar';
import { useEffect, useState } from 'react';
import { getData, getLnurlp } from '../helpers/credentials';
import { AiOutlineCopy } from 'react-icons/ai';

const FundWallet = () => {
    const value = getLnurlp();
    const [show, setShow] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setShow(true);
    }
    return (<>
        <NavbarSample />
        <Container>
            <br />
            <Row className='text-center'>
                <Col className='text-center'>
                    <h4>To send funds to the wallet, scan the following qrcode in your wallet!</h4>
                </Col>
                <h6 style={{color: 'red',
                            font: 'small-caption'}}>We are charging you 25 sats in the first transaction to ensure you'll have enough liqudity for the changes</h6>
            </Row>
            <br />
            <Row>
                <Col className='text-center'>
                    <QRCodeSVG value={value} size={350}/>
                    
                    <Form className='centro custom-form'>
                    <br />
                                <InputGroup>
                                    
                                    <Form.Control
                                        value={value}
                                        disabled
                                    />
                                    <OverlayTrigger
                                    key={'top'}
                                    placement={'top'}
                                    overlay={
                                        <Tooltip>
                                            Copy to clipboard!
                                        </Tooltip>
                                    }
                                    >
                                        <Button variant="primary" id="button-addon2" onClick={handleCopyToClipboard}>
                                            <AiOutlineCopy />
                                        </Button>
                                    </OverlayTrigger>
                                </InputGroup>
                                <Alert show={show} variant="success" key="success" onClose={() => setShow(false)} dismissible>
                                    Lnurl copied to clipboard!
                                </Alert>
                    </Form>
                </Col>
            </Row>
        </Container>
    </>)
}

export default FundWallet;