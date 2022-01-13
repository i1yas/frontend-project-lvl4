/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const uiEntityAdapter = createEntityAdapter();

const initialState = uiEntityAdapter.getInitialState({
  newChannelForm: {
    isShow: false,
    name: '',
  },
});

const uiSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    changeNewChannelName: (state, { payload }) => {
      state.newChannelForm.name = payload.name;
    },
    showNewChannelForm: (state) => {
      state.newChannelForm.isShow = true;
    },
    hideNewChannelForm: (state) => {
      state.newChannelForm.isShow = false;
    },
    resetNewChannelForm: (state) => {
      state.newChannelForm.name = '';
      state.newChannelForm.isShow = false;
    },
  },
});

export const {
  changeNewChannelName,
  showNewChannelForm,
  hideNewChannelForm,
  resetNewChannelForm,
} = uiSlice.actions;

export default uiSlice.reducer;
