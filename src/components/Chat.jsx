import React from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

const messages = Array.from({ length: 20 }).map((_, ind) => ({
  id: ind,
  text: 'Some message',
  author: Math.random() > 0.5 ? 'Admin' : 'john',
}));

const Messages = () => (
  <div>
    {messages.map((msg) => (
      <div key={msg.id}>
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
  <div className="mt-auto">
    <InputGroup>
      <FormControl />
      <Button variant="outline-primary">Send</Button>
    </InputGroup>
  </div>
);

const Chat = () => {
  const currentChannel = useSelector((state) => state.channels.current);

  return (
    <div className="d-flex h-100 flex-column">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <div>
          <strong>
            <span className="me-1">#</span>
            {currentChannel}
          </strong>
        </div>
        <div>2 messages</div>
      </div>
      <div className="px-4 overflow-auto">
        <Messages />
      </div>
      <div className="mt-auto ps-4 pe-5 py-2">
        <Input />
      </div>
    </div>
  );
};

export default Chat;
