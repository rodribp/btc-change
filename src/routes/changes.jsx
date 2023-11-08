import {Row, Col, Container, Card, Button, Table, Badge} from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import NavbarSample from '../components/Navbar';
import { useEffect, useState } from 'react';
import { getData } from '../helpers/credentials';
import timeConverter from '../helpers/unix';
import { getAllVouchersByStore } from '../api/db';

const Changes = () => {
    const credentials = getData();
    const [changes, setChanges] = useState([]);

    const fetchChanges = async () => {
        const response = await getAllVouchersByStore(credentials.sanityId);

        setChanges(response);
    }

    useEffect(() => {
        fetchChanges();
    }, [])
    return (<>
        <NavbarSample />
        <Container>
            <br />

            <Table responsive>
                <thead>
                    <tr>
                        <th>voucher id</th>
                        <th>Amount</th>
                        <th>date</th>
                        <th>status</th>
                        <th>Qr code</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !changes ? 'no changes yet'
                        :
                        changes.map((change) => {
                            return (<tr>
                                <td>{change.id_lnurl}</td>
                                <td>${change.amount_usd}</td>
                                <td>{timeConverter(change.date)}</td>
                                <td>{change.status ? (<Badge bg="success">Available</Badge>) : (<Badge bg="danger">Taken</Badge>)}</td>
                                <td><Button href={'/voucher?uid=' + change.id_lnurl}>See more</Button></td>
                            </tr>)
                        })
                    }
                </tbody>
            </Table>
        </Container>
    </>)
}

export default Changes;