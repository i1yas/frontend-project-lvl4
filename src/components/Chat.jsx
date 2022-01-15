import React from 'react';
import { useSelector } from 'react-redux';
import {
  Form, InputGroup, FormControl, Button,
} from 'react-bootstrap';
import ArrowRightIcon from 'bootstrap-icons/icons/arrow-right.svg';

const messages = Array.from({ length: 20 }).map((_, ind) => ({
  id: ind,
  text: 'Some message',
  author: Math.random() > 0.5 ? 'Admin' : 'john',
}));

const Messages = () => (
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

const Input = () => (
  <Form className="mt-auto">
    <InputGroup>
      <FormControl />
      <Button variant="outline-primary">
        <ArrowRightIcon width={24} height={24} />
      </Button>
    </InputGroup>
  </Form>
);

const Chat = () => {
  const currentChannel = useSelector((state) => {
    const { channels } = state;
    const { current: id } = channels;
    return { id, ...channels.entities[id] };
  });

  return (
    <div className="d-flex h-100 flex-column">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <div>
          <strong>
            <span className="me-1">#</span>
            {currentChannel.name}
          </strong>
        </div>
        <div>2 messages</div>
      </div>
      <div className="px-4 overflow-auto">
        <Messages />
      </div>
      <div className="mt-auto ps-4 pe-5 py-3">
        <Input />
      </div>
    </div>
  );
};

export default Chat;
