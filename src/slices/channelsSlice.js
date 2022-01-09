/* eslint-disable no-param-reassign */

import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes';
import { fetchData } from './common';

const normalizeItems = (items) => items.reduce((acc, item) => {
  const { id, ...rest } = item;
  const newIds = acc.ids.concat(id);
  const newEnities = { ...acc.entities, [id]: rest };

  return { ...acc, ids: newIds, entities: newEnities };
}, { ids: [], entities: {} });

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (channel) => {
    const response = await axios.post(routes.channelsPath(), channel);
    return { channel: response.data };
  },
);

const channelsEntityAdapter = createEntityAdapter();

const initialState = channelsEntityAdapter.getInitialState({
  loading: 'idle',
  adding: 'idle',
  loadingError: null,
  addingError: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {},
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
        state.addingError = null;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        const { channel } = action.payload;
        state.channels = [channel, ...state.channels];
        state.adding = 'idle';
        state.addingError = null;
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.adding = 'error';
        state.addingError = action.error;
      });
  },
});

export default channelsSlice.reducer;
