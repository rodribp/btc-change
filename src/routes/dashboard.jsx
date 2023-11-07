import { Row, Col, Container, Button, Alert } from "react-bootstrap";
import NavbarSample from "../components/Navbar";
import { useState, useEffect } from "react";
import { getData } from "../helpers/credentials";

const Dashboard = () => {
    const [credentials, setCredentials] = useState({
        sanityId: '',
        lnbitsId: '',
        user: '',
        invoiceKey: '',
        walletId: '',
        adminKey: ''
    });

    useEffect(() => {
        setCredentials(getData())
    }, [])

    return (<>
        <NavbarSample />
        <Container>
            <h1>Dashboard</h1>
        </Container>
    </>)
}

export default Dashboard;