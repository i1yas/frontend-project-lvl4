import React from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form, InputGroup, FormControl, Button,
} from 'react-bootstrap';
import ArrowRightIcon from 'bootstrap-icons/icons/arrow-right.svg';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

import useAuth, { useWebsocket } from '../hooks';
import { addMessage } from '../slices/messagesSlice';

const Messages = ({ messages }) => (
  <div>
    {messages.map((msg) => (
      <div key={msg.id} className="mb-2">
        <strong>
          {msg.author}
        </strong>
        :
        <span className="ms-1">{msg.text}</span>
      </div>
    ))}
  </div>
);

const Input = () => {
  const [text, setText] = React.useState('');
  const hasBadWords = filter.check(text);
  const { socket } = useWebsocket();
  const { username } = useAuth();
  const currentChannelId = useSelector((state) => state.channels.current);
  const dispatch = useDispatch();
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.focus();
  }, [currentChannelId]);

  React.useEffect(() => {
    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasBadWords) return;
    const message = { author: username, text, channelId: currentChannelId };
    socket.emit('newMessage', message, () => {
      setText('');
    });
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <Form className="mt-auto" onSubmit={handleSubmit}>
      <InputGroup>
        <FormControl
          ref={ref}
          value={text}
          onChange={handleChange}
          className={cn({
            'is-invalid': hasBadWords,
          })}
        />
        {/* <Form.Control.Feedback type="invalid">test</Form.Control.Feedback> */}
        <Button type="submit" variant="outline-primary" disabled={hasBadWords}>
          <ArrowRightIcon width={24} height={24} />
        </Button>
      </InputGroup>
    </Form>
  );
};

const Chat = () => {
  const currentChannel = useSelector((state) => {
    const { channels } = state;
    const { current: id } = channels;
    return { id, ...channels.entities[id] };
  });
  const { t } = useTranslation();

  const messages = useSelector((state) => state.messages.items.filter(
    (msg) => msg.channelId === currentChannel.id,
  ));

  const count = messages.length;

  return (
    <div className="d-flex h-100 flex-column">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <div>
          <strong>
            <span className="me-1">#</span>
            {currentChannel.name}
          </strong>
        </div>
        <div>
          {count}
          {' '}
          {t('chat.message', { count })}
        </div>
      </div>
      <div className="px-4 overflow-auto">
        <Messages messages={messages} />
      </div>
      <div className="mt-auto ps-4 pe-5 py-3">
        <Input />
      </div>
    </div>
  );
};

export default Chat;
