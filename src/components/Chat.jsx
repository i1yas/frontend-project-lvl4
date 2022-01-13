import React from 'react';
import { useSelector } from 'react-redux';

const Messages = () => 'messages here';

const Chat = () => {
  const currentChannel = useSelector((state) => state.channels.current);

  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <div>
          <strong>
            <span className="me-1">#</span>
            {currentChannel}
          </strong>
        </div>
        <div>2 messages</div>
      </div>
      <div className="px-4">
        <Messages />
      </div>
    </>
  );
};

export default Chat;
