/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dropdown, Button, ButtonGroup, Nav, Form, Modal,
} from 'react-bootstrap';
import PlusIcon from 'bootstrap-icons/icons/plus-square.svg';

import {
  selectChannel, addChannel, removeChannel, renameChannel,
} from '../slices/channelsSlice';
import {
  showNewChannelModal, showRenameChannelModal, hideModal,
} from '../slices/uiSlice';
import { useWebsocket } from '../hooks';

const NewChannelModal = () => {
  const dispatch = useDispatch();
  const { socket } = useWebsocket();
  const [name, setName] = React.useState('');
  const modal = useSelector((state) => state.ui.modal);
  const ref = React.useRef(null);
  const show = modal.name === 'newChannel';

  React.useEffect(() => {
    if (show) ref.current.focus();
  }, [show]);

  const handleNewChannelSubmit = (e) => {
    e.preventDefault();
    socket.emit('newChannel', { name }, ({ data }) => {
      dispatch(addChannel(data));
      setName('');
      dispatch(hideModal());
      dispatch(selectChannel({ channelId: data.id }));
    });
  };

  const handleNewChannelNameChange = (e) => {
    setName(e.target.value);
  };

  const handleClose = () => {
    dispatch(hideModal());
    setName('');
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleNewChannelSubmit}>
        <Modal.Header>
          <Modal.Title>Новый канал</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Form.Control
            type="text"
            size="sm"
            value={name}
            onChange={handleNewChannelNameChange}
            ref={ref}
          />
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <Button type="submit" variant="primary">Добавить</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const { socket } = useWebsocket();
  const modal = useSelector((state) => state.ui.modal);
  const ref = React.useRef(null);
  const show = modal.name === 'renameChannel';
  const { channel } = modal;
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    if (channel) setName(channel.name);
    if (show) ref.current.focus();
  }, [show]);

  const handleRenameChannelSubmit = (e) => {
    e.preventDefault();
    const payload = { id: channel.id, name };
    socket.emit('renameChannel', payload, () => {
      dispatch(renameChannel(payload));
      setName('');
      dispatch(hideModal());
    });
  };

  const handleNewChannelNameChange = (e) => {
    setName(e.target.value);
  };

  const handleClose = () => {
    dispatch(hideModal());
    setName('');
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleRenameChannelSubmit}>
        <Modal.Header>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Form.Control
            type="text"
            size="sm"
            value={name}
            onChange={handleNewChannelNameChange}
            ref={ref}
          />
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <Button type="submit" variant="primary">Сохранить</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const currentChannelId = channels.current;
  const { socket } = useWebsocket();

  const handleAddButtonClick = () => {
    dispatch(showNewChannelModal());
  };

  const handleClick = (id) => () => dispatch(selectChannel({ channelId: id }));

  const handleOptionSelect = (channel) => (eventKey) => {
    if (eventKey === 'remove') {
      const { id } = channel;
      socket.emit('removeChannel', { id }, () => {
        dispatch(removeChannel(id));
        if (currentChannelId === id) dispatch(selectChannel({ channelId: 1 }));
      });
    }
    if (eventKey === 'rename') {
      dispatch(showRenameChannelModal({ channel }));
    }
  };

  const renderChannels = () => {
    const items = channels.ids.map((id) => {
      const channel = channels.entities[id];

      const isCurrent = currentChannelId === id;

      const btnVariant = isCurrent ? 'secondary' : null;

      const btn = channel.removable ? (
        <Dropdown as={ButtonGroup} className="w-100" onSelect={handleOptionSelect({ id, ...channel })}>
          <Button
            className="w-100 rounded-0 text-start"
            variant={btnVariant}
            onClick={handleClick(id)}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
          <Dropdown.Toggle
            split
            id="channel-options"
            variant={btnVariant}
            className="rounded-0"
          />
          <Dropdown.Menu>
            <Dropdown.Item eventKey="remove">
              Удалить
            </Dropdown.Item>
            <Dropdown.Item eventKey="rename">
              Переименовать
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          variant={btnVariant}
          className="w-100 rounded-0 text-start"
          onClick={handleClick(id)}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
      );

      return (
        <Nav.Item key={id} className="w-100">
          {btn}
        </Nav.Item>
      );
    });

    return <Nav variant="pills" className="flex-column">{items}</Nav>;
  };

  return (
    <>
      <div className="px-2 pt-5">
        <div className="mb-2">
          <div
            style={{ alignItems: 'center' }}
            className="d-flex justify-content-between ps-2"
          >
            <span>
              channels
            </span>
            <Button
              size="sm"
              type="button"
              variant={false}
              onClick={handleAddButtonClick}
              className="p-0 m-0 text-primary"
            >
              <PlusIcon width={20} height={20} />
            </Button>
          </div>
          {channels.loading === 'loading' && (
            <div className="text-muted">
              Loading channels
            </div>
          )}
        </div>
        {channels.loading === 'idle' && renderChannels()}
      </div>
      <NewChannelModal />
      <RenameChannelModal />
    </>
  );
};

export default Channels;
