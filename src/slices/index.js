import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice';
import messagesSlice from './messagesSlice';
import uiReducer from './uiSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesSlice,
    ui: uiReducer,
  },
});
