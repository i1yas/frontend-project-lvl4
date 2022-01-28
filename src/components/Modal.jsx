/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Modal } from 'react-bootstrap';

// const getContainer = () => document.querySelector('body > div');

// const CustomModal = (props) => {
//   const { show } = props;

//   React.useEffect(() => {
//     const container = getContainer();
//     if (show) container.ariaHidden = true;
//     else delete container.ariaHidden;
//   }, [show]);

//   // const newProps = { ...props, 'aria-hidden': !show };

//   return <Modal {...props} />;
// };


// Object.keys(Modal)
//   .filter((key) => key.match(/^[A-Z].*/))
//   .forEach((key) => {
//     CustomModal[key] = Modal[key];
//   });

export default Modal;
