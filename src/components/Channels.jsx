import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Nav, Form,
} from 'react-bootstrap';
import PlusIcon from 'bootstrap-icons/icons/plus-square.svg';

import { selectChannel, addChannel } from '../slices/channelsSlice';
import {
  changeNewChannelName, showNewChannelForm,
} from '../slices/uiSlice';

const Channels = () => {
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);
  const channels = useSelector((state) => state.channels);
  const currentChannel = channels.current;

  const handleAddButtonClick = () => {
    dispatch(showNewChannelForm(true));
  };

  const handleNewChannelNameChange = (e) => {
    dispatch(changeNewChannelName({ name: e.target.value }));
  };

  const handleNewChannelSubmit = (e) => {
    e.preventDefault();
    dispatch(addChannel({ name: ui.newChannelForm.name }));
  };

  const renderChannels = () => {
    const items = channels.ids.map((id) => {
      const channel = channels.entities[id];

      const handleClick = () => dispatch(selectChannel({ channelId: channel.name }));

      const isCurrent = currentChannel === channel.name;

      return (
        <Nav.Item key={id} className="w-100">
          <Button
            variant={isCurrent ? 'secondary' : null}
            onClick={handleClick}
            className="w-100 rounded-0 text-start"
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
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
