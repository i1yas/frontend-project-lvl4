/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dropdown, Button, ButtonGroup, Nav, Form,
  Modal,
} from 'react-bootstrap';
import PlusIcon from 'bootstrap-icons/icons/plus-square.svg';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  selectChannel, addChannel, removeChannel, renameChannel,
  setAdding, setRemoving, setRenaming,
} from '../slices/channelsSlice';
import {
  showNewChannelModal, showRenameChannelModal, showRemoveChannelModal, hideModal,
} from '../slices/uiSlice';
import { useWebsocket } from '../hooks';

const NewChannelModal = () => {
  const dispatch = useDispatch();
  const { socket } = useWebsocket();
  const [name, setName] = React.useState('');
  const modal = useSelector((state) => state.ui.modal);
  const adding = useSelector((state) => state.channels.adding);
  const error = useSelector((state) => state.channels.addingError);
  const channelNames = useSelector((state) => (
    state.channels.ids.map((id) => state.channels.entities[id].name)
  ));
  const ref = React.useRef(null);
  const show = modal.name === 'newChannel';
  const { t } = useTranslation();

  React.useEffect(() => {
    if (show) ref.current.focus();
  }, [show]);

  const handleNewChannelSubmit = (e) => {
    e.preventDefault();

    if (channelNames.includes(name)) throw new Error('channelExists');

    dispatch(setAdding('loading'));
    socket.emit('newChannel', { name }, ({ data }) => {
      dispatch(setAdding('idle'));
      setName('');
      dispatch(hideModal());
      dispatch(selectChannel({ channelId: data.id }));
      toast.success(t('channels.added'));
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
          <Modal.Title>{t('channels.addChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Form.Control
            type="text"
            size="sm"
            value={name}
            onChange={handleNewChannelNameChange}
            ref={ref}
            aria-label={t('channels.name')}
          />
          {adding === 'error' && (
            <Form.Text className="w-100 text-danger">{t(`formErrors.${error.message}`)}</Form.Text>
          )}
          <Button variant="secondary" onClick={handleClose}>{t('form.cancel')}</Button>
          <Button
            type="submit"
            variant="primary"
            disabled={adding === 'loading'}
          >
            {t('form.send')}
          </Button>
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
  const { t } = useTranslation();

  React.useEffect(() => {
    if (channel) setName(channel.name);
    if (show) ref.current.focus();
  }, [show, channel]);

  const handleRenameChannelSubmit = (e) => {
    e.preventDefault();
    const payload = { id: channel.id, name };
    dispatch(setRenaming('loading'));
    socket.emit('renameChannel', payload, () => {
      dispatch(setRenaming('idle'));
      setName('');
      dispatch(hideModal());
      toast.success(t('channels.renamed'));
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
          <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Form.Control
            type="text"
            size="sm"
            value={name}
            onChange={handleNewChannelNameChange}
            ref={ref}
            aria-label={t('channels.name')}
          />
          <Button variant="secondary" onClick={handleClose}>{t('form.cancel')}</Button>
          <Button type="submit" variant="primary">{t('form.send')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const { socket } = useWebsocket();
  const modal = useSelector((state) => state.ui.modal);
  const show = modal.name === 'removeChannel';
  const { channel } = modal;
  const { t } = useTranslation();

  const handleRenameChannelSubmit = (e) => {
    e.preventDefault();
    const payload = { id: channel.id };
    dispatch(setRemoving('loading'));
    socket.emit('removeChannel', payload, () => {
      dispatch(setRemoving('idle'));
      dispatch(hideModal());
      toast.success(t('channels.removed'));
    });
  };

  const handleClose = () => {
    dispatch(hideModal());
  };

  return (
    <Modal show={show} onHide={handleClose} autoFocus>
      <Form onSubmit={handleRenameChannelSubmit}>
        <Modal.Header>
          <Modal.Title>{t('channels.removeChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{t('channels.removeChannelConfirmation', { name: channel?.name })}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>{t('form.cancel')}</Button>
          <Button type="submit" variant="primary">{t('channels.remove')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels);
  const currentChannelId = channels.current;
  const isModalOpen = useSelector((state) => !!state.ui.modal.name);

  const handleClick = (id) => () => dispatch(selectChannel({ channelId: id }));

  const handleOptionSelect = (channel) => (eventKey) => {
    if (eventKey === 'remove') {
      dispatch(showRemoveChannelModal({ channel }));
    }
    if (eventKey === 'rename') {
      dispatch(showRenameChannelModal({ channel }));
    }
  };

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
          aria-label={t('channels.manage')}
        />
        <Dropdown.Menu>
          <Dropdown.Item eventKey="remove" aria-label={t('channels.remove')}>
            {t('channels.remove')}
          </Dropdown.Item>
          <Dropdown.Item eventKey="rename" aria-label={t('channels.rename')}>
            {t('channels.rename')}
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

  return <Nav variant="pills" className="flex-column" aria-hidden={isModalOpen}>{items}</Nav>;
};

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const error = channels.loadingError;
  const { socket } = useWebsocket();
  const { t } = useTranslation();

  const handleAddButtonClick = () => {
    dispatch(showNewChannelModal());
  };

  React.useEffect(() => {
    socket.on('newChannel', (data) => {
      dispatch(addChannel(data));
    });

    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannel(id));
    });

    socket.on('renameChannel', (data) => {
      dispatch(renameChannel(data));
    });
  }, [socket]);

  return (
    <>
      <div className="px-2 pt-5">
        <div className="mb-2">
          <div
            style={{ alignItems: 'center' }}
            className="d-flex justify-content-between ps-2"
          >
            <span>
              {t('channels.title')}
            </span>
            <Button
              size="sm"
              type="button"
              variant={false}
              onClick={handleAddButtonClick}
              className="p-0 m-0 text-primary"
              aria-label="+"
            >
              <PlusIcon width={20} height={20} />
            </Button>
          </div>
          {channels.loading === 'loading' && (
            <div className="text-muted">
              Loading channels
            </div>
          )}
          {error && (
            <div className="text-muted">
              {t('errors.connection')}
            </div>
          )}
        </div>
        {channels.loading === 'idle' && <ChannelsList />}
      </div>
      <NewChannelModal />
      <RenameChannelModal />
      <RemoveChannelModal />
    </>
  );
};

export default Channels;
