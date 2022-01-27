/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Modal } from 'react-bootstrap';

const getContainer = () => document.querySelector('body > div');

const CustomModal = (props) => {
  const onShow = () => {
    const container = getContainer();
    container.ariaHidden = true;
  };
  const onHide = () => {
    const container = getContainer();
    container.ariaHidden = false;
  };
  const newProps = { ...props, onShow, onHide };

  return <Modal {...newProps} />;
};

Object.keys(Modal)
  .filter((key) => key.match(/^[A-Z].*/))
  .forEach((key) => {
    CustomModal[key] = Modal[key];
  });

export default CustomModal;
