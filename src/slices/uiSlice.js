/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const uiEntityAdapter = createEntityAdapter();

const initialState = uiEntityAdapter.getInitialState({
  modal: { name: null },
});

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNewChannelModal: (state) => {
      state.modal = {
        name: 'newChannel',
      };
    },
    showRenameChannelModal: (state, { payload }) => {
      state.modal = {
        name: 'renameChannel',
        channel: payload.channel,
      };
    },
    showRemoveChannelModal: (state, { payload }) => {
      state.modal = {
        name: 'removeChannel',
        channel: payload.channel,
      };
    },
    hideModal: (state) => {
      state.modal = initialState.modal;
    },
  },
});

export const {
  showNewChannelModal,
  showRenameChannelModal,
  showRemoveChannelModal,
  hideModal,
} = uiSlice.actions;

export default uiSlice.reducer;
