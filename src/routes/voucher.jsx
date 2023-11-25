import { useEffect, useState } from "react";
import NavbarSample from "../components/Navbar";
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge } from "react-bootstrap";
import { getVoucherByUid } from "../api/db";
import { QRCodeSVG } from "qrcode.react";
import timeConverter from "../helpers/unix";
import { AiFillPrinter } from 'react-icons/ai';
import {PrintTicket, SendTicket} from "../tickets/print";
import { getData } from "../helpers/credentials";

const VoucherRapid = (props) => {
    const uid = props.uid;
    const [infoVoucher, setInfoVoucher] = useState({
        amount_sats: '',
        amount_usd: '',
        status: '',
        link_lnurl: '',
        date: '0',
        _id: ''
    });
    const { user } = getData();

    const getVoucher = async () => {
        
        const response = await getVoucherByUid(uid);
        

        if (!response[0]) {
            return;
        }

        setInfoVoucher(response[0]);
    }

    useEffect(() => {
        getVoucher();
    }, [props.uid])

    return infoVoucher._id == '' ? (
            <Spinner animation="border" role="status" size="300">
                <span className="visually-hidden">Loading...</span>
            </Spinner>) : (
        <>
                    <h5>Your voucher</h5>
                    <br />
                    <Row>
                        
                        <Col sm={12} md={4}>
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
                                <Button onClick={() => PrintTicket(timeConverter(infoVoucher.date), timeConverter(infoVoucher.date), 0, infoVoucher.amount_usd, infoVoucher.amount_sats, infoVoucher.link_lnurl, user)}><AiFillPrinter size={25} /> Print voucher</Button></>)
                            }
                        </Col>
                    </Row>
        </>
    )
}

export default VoucherRapid;