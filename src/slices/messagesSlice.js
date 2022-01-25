/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { fetchData } from './common';
import { removeChannel } from './channelsSlice';

const messagesEntityAdapder = createEntityAdapter();

const initialState = messagesEntityAdapder.getInitialState({
  items: [],
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.items.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      state.items = payload.messages;
    });

    builder.addCase(removeChannel, (state, { payload }) => {
      const id = payload;
      state.items = state.items.filter((msg) => msg.channelId !== id);
    });
  },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
