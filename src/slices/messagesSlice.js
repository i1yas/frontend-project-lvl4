/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchData } from './common';

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
  },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
