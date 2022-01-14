import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Container, Row, Col, Navbar, Button,
} from 'react-bootstrap';

import Channels from './Channels';
import Chat from './Chat';
import useAuth from '../hooks';
import { fetchData } from '../slices/common';

const Header = () => {
  const auth = useAuth();

  const handleLogOut = () => {
    localStorage.removeItem('userId');
    auth.logOut();
  };

  return (
    <Navbar>
      <Container>
        <Navbar.Brand>Slack chat</Navbar.Brand>
        <Button onClick={handleLogOut}>Log out</Button>
      </Container>
    </Navbar>
  );
};

const MainPage = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchData());
  }, []);

  return (
    <>
      <Header />
      <Container fluid="md" className="shadow rounded overflow-hidden my-4 h-100">
        <Row className="h-100">
          <Col md={2} className="px-0 h-100 bg-light border-end">
            <Channels />
          </Col>
          <Col md className="px-0 h-100">
            <Chat />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainPage;
