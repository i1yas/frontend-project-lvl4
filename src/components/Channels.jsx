/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dropdown, Button, ButtonGroup, Nav, Form,
} from 'react-bootstrap';
import PlusIcon from 'bootstrap-icons/icons/plus-square.svg';

import { selectChannel, addChannel, removeChannel } from '../slices/channelsSlice';
import {
  changeNewChannelName, showNewChannelForm, resetNewChannelForm,
} from '../slices/uiSlice';
import { useWebsocket } from '../hooks';

const Channels = () => {
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);
  const channels = useSelector((state) => state.channels);
  const currentChannelId = channels.current;

  const { socket } = useWebsocket();

  const handleAddButtonClick = () => {
    dispatch(showNewChannelForm(true));
  };

  const handleNewChannelNameChange = (e) => {
    dispatch(changeNewChannelName({ name: e.target.value }));
  };

  const handleNewChannelSubmit = (e) => {
    e.preventDefault();
    socket.emit('newChannel', { name: ui.newChannelForm.name }, ({ data }) => {
      dispatch(addChannel(data));
      dispatch(resetNewChannelForm());
    });
  };

  const renderChannels = () => {
    const items = channels.ids.map((id) => {
      const channel = channels.entities[id];

      const handleClick = () => dispatch(selectChannel({ channelId: id }));
      const handleOptionSelect = (eventKey) => {
        if (eventKey === 'remove') {
          socket.emit('removeChannel', { id }, () => {
            dispatch(removeChannel(id));
          });
        }
      };

      const isCurrent = currentChannelId === id;

      const btnVariant = isCurrent ? 'secondary' : null;

      const btn = channel.removable ? (
        <Dropdown as={ButtonGroup} className="w-100" onSelect={handleOptionSelect}>
          <Button
            className="w-100 rounded-0 text-start"
            variant={btnVariant}
            onClick={handleClick}
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
          onClick={handleClick}
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
            {!ui.newChannelForm.isShow && (
            <Button
              size="sm"
              type="button"
              variant={false}
              onClick={handleAddButtonClick}
              className="p-0 m-0 text-primary"
            >
              <PlusIcon width={20} height={20} />
            </Button>
            )}
          </div>
          {ui.newChannelForm.isShow && (
            <Form onSubmit={handleNewChannelSubmit}>
              <Form.Control
                type="text"
                size="sm"
                value={ui.newChannelForm.name}
                onChange={handleNewChannelNameChange}
              />
            </Form>
          )}
          {channels.loading === 'loading' && (
            <div className="text-muted">
              Loading channels
            </div>
          )}
        </div>
        {channels.loading === 'idle' && renderChannels()}
      </div>
    </>
  );
};

export default Channels;
