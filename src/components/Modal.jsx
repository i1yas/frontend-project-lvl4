/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Modal } from 'react-bootstrap';

const getContainer = () => document.querySelector('body > div');

const CustomModal = (props) => {
  const { show } = props;

  React.useEffect(() => {
    const container = getContainer();
    container.ariaHidden = Boolean(show);
  }, [show]);

  return <Modal {...props} />;
};

Object.keys(Modal)
  .filter((key) => key.match(/^[A-Z].*/))
  .forEach((key) => {
    CustomModal[key] = Modal[key];
  });

export default CustomModal;
