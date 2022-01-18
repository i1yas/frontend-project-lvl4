/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchData } from './common';

const createAsyncThunkWithCallback = (name) => createAsyncThunk(
  name,
  async (fn) => new Promise((resolve) => {
    fn((data) => {
      resolve(data);
    });
  }),
);

export const addChannel = createAsyncThunkWithCallback('channels/addChannel');
export const removeChannel = createAsyncThunkWithCallback('channels/removeChannel');
export const renameChannel = createAsyncThunkWithCallback('channels/renameChannel');

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
  addingError: null,
  current: getInitialChannel(),
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, { payload }) => {
      state.current = payload.channelId;
    },
    // removeChannel: channelsEntityAdapter.removeOne,
    // renameChannel: (state, { payload }) => {
    //   const { id, name } = payload;
    //   state.entities[id].name = name;
    // },
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
      .addCase(addChannel.pending, (state) => {
        state.adding = 'loading';
      })
      .addCase(addChannel.fulfilled, channelsEntityAdapter.addOne);

    builder
      .addCase(removeChannel.pending, (state) => {
        state.removing = 'loading';
      })
      .addCase(removeChannel.fulfilled, channelsEntityAdapter.removeOne);

    builder
      .addCase(renameChannel.pending, (state) => {
        state.renaming = 'loading';
      })
      .addCase(renameChannel.fulfilled, (state, { payload }) => {
        const { id, name } = payload;
        state.entities[id].name = name;
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;

export const selectChannel = (payload) => (dispatch) => {
  dispatch(setCurrentChannel(payload));
  localStorage.currentChannel = payload.channelId;
};

export default channelsSlice.reducer;
