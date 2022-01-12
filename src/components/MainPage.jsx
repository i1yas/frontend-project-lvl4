import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Row, Col, Navbar, Button,
} from 'react-bootstrap';

import useAuth from '../hooks';
import { fetchData } from '../slices/common';
import { selectChannel, addChannel } from '../slices/channelsSlice';

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
  const [showAddingForm, setShowAddingForm] = React.useState(false);
  const [newChannelName, setNewChannelName] = React.useState('');
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const currentChannel = channels.current;

  const handleAddButtonClick = () => {
    setShowAddingForm(true);
  };

  const handleNewChannelNameChange = (e) => {
    setNewChannelName(e.target.value);
  };

  const handleNewChannelSubmit = (e) => {
    e.preventDefault();
    dispatch(addChannel({ name: newChannelName }));
  };

  const renderChannels = () => channels.ids.map((id) => {
    const channel = channels.entities[id];

    const handleClick = () => dispatch(selectChannel({ channelId: channel.name }));

    return (
      <div key={id}>
        <button type="button" onClick={handleClick}>
          #
          {' '}
          {channel.name === currentChannel ? <strong>{channel.name}</strong> : channel.name}
        </button>
      </div>
    );
  });

  return (
    <>
      <div>
        channels
        {' '}
        {!showAddingForm && (
          <button type="button" onClick={handleAddButtonClick}>+</button>
        )}
        {showAddingForm && (
          <form onSubmit={handleNewChannelSubmit}>
            <input type="text" value={newChannelName} onChange={handleNewChannelNameChange} />
          </form>
        )}
      </div>
      {channels.loading === 'loading' && (
        <div>
          <strong>Loading channels</strong>
        </div>
      )}
      {channels.loading === 'idle' && renderChannels()}
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
