import {Row, Col, Container, Card, Button, Table, Badge} from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import NavbarSample from '../components/Navbar';
import { useEffect, useState } from 'react';
import { getData } from '../helpers/credentials';
import timeConverter from '../helpers/unix';
import { getAllVouchersByStore, updateStatusVoucher } from '../api/db';
import { getTransactions } from '../api/lnbits';

const Changes = () => {
    const credentials = getData();
    const [changes, setChanges] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const fetchChanges = async () => {
        const responseLnbits = await getTransactions(credentials.invoiceKey);
        var response = await getAllVouchersByStore(credentials.sanityId);
        responseLnbits.map(async (res1) => {
            response.map(async (res2) => {
                if (res1.memo == res2.id_lnurl && res2.status) {
                    const res = await updateStatusVoucher(res2._id);

                }
            })
        })

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