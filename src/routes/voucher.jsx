import { useEffect, useState } from "react";
import NavbarSample from "../components/Navbar";
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge } from "react-bootstrap";
import { getVoucherByUid } from "../api/db";
import { QRCodeSVG } from "qrcode.react";
import timeConverter from "../helpers/unix";
import { AiFillPrinter } from 'react-icons/ai';

const Voucher = () => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");
    const [infoVoucher, setInfoVoucher] = useState({
        amount_sats: '',
        amount_usd: '',
        status: '',
        link_lnurl: '',
        date: '0',
        _id: ''
    });

    const getVoucher = async () => {
        
        const response = await getVoucherByUid(uid);
        

        if (!response[0]) {
            return;
        }

        setInfoVoucher(response[0]);
    }

    useEffect(() => {
        getVoucher();
    }, [])

    return (
        <>
            <NavbarSample />
            <Container>
                <Row>
                    
                    <Col sm={12} md={4}>
                        <br />
                        <QRCodeSVG value={infoVoucher.link_lnurl}  size={350}/>
                    </Col>
                    <Col sm={12} md={8}>
                        <br />
                        {
                            !infoVoucher._id ? (<h4>Not found</h4>) : 
                            (<><h4>Voucher id: {uid}</h4>
                            <h4>Amount in USD: ${infoVoucher.amount_usd}</h4>
                            <h4>Amount in SATS: {infoVoucher.amount_sats}</h4>
                            <h4>Date: {timeConverter(infoVoucher.date)}</h4>
                            <br />
                            <Button><AiFillPrinter size={25} /> Print voucher</Button></>)
                        }
                        
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Voucher;