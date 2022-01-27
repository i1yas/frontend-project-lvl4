/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Modal } from 'react-bootstrap';

const getContainer = () => document.getElementById('chat');

const CustomModal = (props) => {
  const onEnter = () => {
    const container = getContainer();
    container.ariaHidden = true;
  };
  const onExit = () => {
    const container = getContainer();
    container.ariaHidden = false;
  };
  const newProps = { ...props, onEnter, onExit };

  return <Modal {...newProps} />;
};

Object.keys(Modal)
  .filter((key) => key.match(/^[A-Z].*/))
  .forEach((key) => {
    CustomModal[key] = Modal[key];
  });

export default CustomModal;
