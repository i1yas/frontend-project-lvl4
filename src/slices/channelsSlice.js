/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchData } from './common';

const normalizeItems = (items) => items.reduce((acc, item) => {
  const { id, ...rest } = item;
  const newIds = acc.ids.concat(id);
  const newEnities = { ...acc.entities, [id]: rest };

  return { ...acc, ids: newIds, entities: newEnities };
}, { ids: [], entities: {} });

const channelsEntityAdapter = createEntityAdapter();

const getInitialChannel = () => {
  const storageValue = localStorage.currentChannel || 'general';
  return storageValue;
};

const initialState = channelsEntityAdapter.getInitialState({
  loading: 'idle',
  adding: 'idle',
  loadingError: null,
  addingError: null,
  current: getInitialChannel(),
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    selectChannel: (state, { payload }) => {
      state.current = payload.channelId;
      localStorage.currentChannel = payload.channelId;
    },
    addChannel: channelsEntityAdapter.addOne,
    removeChannel: channelsEntityAdapter.removeOne,
    renameChannel: (state, { payload }) => {
      const { id, name } = payload;
      state.entities[id].name = name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = 'loading';
        state.loadingError = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        Object.assign(state, normalizeItems(action.payload.channels));
        state.loading = 'idle';
        state.loadingError = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = 'error';
        state.loadingError = action.error;
      });

    builder
      .addCase(channelsEntityAdapter.removeOne, () => {
        // should reset current channel here
      });
  },
});

export const {
  addChannel, removeChannel, renameChannel, selectChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
