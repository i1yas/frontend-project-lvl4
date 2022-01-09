/* eslint-disable import/prefer-default-export */

import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes';

export const fetchData = createAsyncThunk(
  'app/fetchData',
  async () => {
    const { token } = JSON.parse(localStorage.getItem('userId'));
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(routes.dataPath(), { headers });
    return response.data;
  },
);
