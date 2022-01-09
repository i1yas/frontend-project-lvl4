import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Row, Col, Navbar, Button,
} from 'react-bootstrap';

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

const Channels = () => {
  const channels = useSelector((state) => state.channels);

  const renderChannels = () => channels.ids.map((id) => {
    const channel = channels.entities[id];
    return <div key={id}>{channel.name}</div>;
  });

  return (
    <>
      channels
      {renderChannels()}
    </>
  );
};

const Chat = () => 'chat';

const MainPage = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchData());
  }, []);

  return (
    <>
      <Header />
      <Container fluid="md" className="shadow rounded overflow-hidden my-4 h-100">
        <Row>
          <Col md={2} className="px-0">
            <Channels />
          </Col>
          <Col md className="px-0">
            <div style={{ background: 'red' }}>line</div>
            <Chat />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainPage;
