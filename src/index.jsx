// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import '../assets/application.scss';
import init from './init';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io('/');
const app = init(socket);

ReactDOM.render(app, document.querySelector('#chat'));
