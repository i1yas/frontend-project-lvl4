import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice';
import uiReducer from './uiSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    ui: uiReducer,
  },
});
