/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { fetchData } from './common';

const normalizeItems = (items) => items.reduce((acc, item) => {
  const { id, ...rest } = item;
  const newIds = acc.ids.concat(id);
  const newEntities = { ...acc.entities, [id]: rest };

  return { ...acc, ids: newIds, entities: newEntities };
}, { ids: [], entities: {} });

const channelsEntityAdapter = createEntityAdapter();

const getInitialChannel = () => {
  const storageValue = localStorage.currentChannel || 1;
  return Number(storageValue);
};

const initialState = channelsEntityAdapter.getInitialState({
  loading: 'idle',
  adding: 'idle',
  removing: 'idle',
  renaming: 'idle',
  loadingError: null,
  current: getInitialChannel(),
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsEntityAdapter.addOne,
    removeChannel: (state, action) => {
      channelsEntityAdapter.removeOne(state, action);
      const id = action.payload;
      if (state.current === id) state.current = 1;
    },
    renameChannel: (state, { payload }) => {
      const { id, name } = payload;
      state.entities[id].name = name;
    },
    setAdding: (state, { payload }) => {
      state.adding = payload.state;
    },
    setRemoving: (state, { payload }) => {
      state.removing = payload;
    },
    setRenaming: (state, { payload }) => {
      state.renaming = payload;
    },
    setCurrentChannel: (state, { payload }) => {
      state.current = payload.channelId;
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
        if (!state.entities[state.current]) state.current = 1;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = 'error';
        state.loadingError = action.error;
      });
  },
});

export const {
  addChannel, removeChannel, renameChannel, setCurrentChannel,
  setAdding, setRemoving, setRenaming,
} = channelsSlice.actions;

export const selectChannel = (payload) => (dispatch) => {
  dispatch(setCurrentChannel(payload));
  localStorage.currentChannel = payload.channelId;
};

export default channelsSlice.reducer;
