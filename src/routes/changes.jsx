import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Container } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import NavbarSample from '../components/Navbar';
import { getData } from '../helpers/credentials';
import timeConverter from '../helpers/unix';
import { getAllVouchersByStore, updateStatusVoucher } from '../api/db';
import { getTransactions, getVouchers } from '../api/lnbits';

const Changes = () => {
  const credentials = getData();
  const [changes, setChanges] = useState([]);

  const fetchChanges = async () => {
    try {
      const responseLnbits = await getVouchers(credentials.invoiceKey);
      const responseDB = await getAllVouchersByStore(credentials.sanityId);

      const dbVoucherData = {};
      responseDB.forEach((voucher) => {
        dbVoucherData[voucher.id_lnurl] = voucher;
      });

      const mergedChanges = responseLnbits.map((lnbitChange) => (
        {
        ...lnbitChange,
        amount_usd: dbVoucherData[lnbitChange.title]?.amount_usd || 0,
      }));

      setChanges(mergedChanges);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchChanges();
  }, []);

  return (
    <>
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
            {!changes ? (
              <tr>
                <td colSpan="5">No changes yet</td>
              </tr>
            ) : (
              changes.map((change, index) => (
                <tr key={change.title}>
                  <td>{change.title}</td>
                  <td>${change.amount_usd}</td>
                  <td>{timeConverter(change.open_time)}</td>
                  <td>
                    {!change.used ? (
                      <Badge bg="success">Available</Badge>
                    ) : (
                      <Badge bg="danger">Taken</Badge>
                    )}
                  </td>
                  <td>
                    <Button href={'/voucher?uid=' + change.title}>See more</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Changes;
