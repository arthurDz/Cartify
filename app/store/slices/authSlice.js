import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/client';
import {mmkv} from '../mmkv';

const storage = mmkv; 

const initialState = {
  user: null,
  accessToken: storage.getString('access') || null,
  refreshToken: storage.getString('refresh') || null,
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (payload, {rejectWithValue}) => {
    try {
      const {data} = await api.post('/users', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const {data} = await api.post('/auth/login', {email, password});
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    refreshTokenFulfilled: (state, {payload}) => {
      state.accessToken = payload.access_token;
      state.refreshToken = payload.refresh_token ?? state.refreshToken;
      storage.set('access', payload.access_token);
      if (payload.refresh_token) storage.set('refresh', payload.refresh_token);
    },
    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      storage.delete('access');
      storage.delete('refresh');
    },
  },
  extraReducers: builder => {
    builder
      // signup
      .addCase(signUp.pending, s => {
        s.loading = true;
        s.error = null;
      })
      .addCase(signUp.fulfilled, (s, {payload}) => {
        s.loading = false;
        s.user = payload;
      })
      .addCase(signUp.rejected, (s, {payload}) => {
        s.loading = false;
        s.error = payload;
      })
      // login
      .addCase(login.pending, s => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, {payload}) => {
        s.loading = false;
        s.accessToken = payload.access_token;
        s.refreshToken = payload.refresh_token;
        storage.set('access', payload.access_token);
        storage.set('refresh', payload.refresh_token);
      })
      .addCase(login.rejected, (s, {payload}) => {
        s.loading = false;
        s.error = payload;
      });
  },
});

export const {logout, refreshTokenFulfilled} = authSlice.actions;
export default authSlice.reducer;