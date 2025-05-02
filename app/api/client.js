import axios from 'axios';
import {store} from '../store';
import {logout, refreshTokenFulfilled} from '../store/slices/authSlice';

const API_URL = 'https://api.escuelajs.co/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

if (__DEV__) {
  api.interceptors.request.use(config => {
    const fullURL = axios.getUri(config);
    console.log(
      `[API] ${config.method?.toUpperCase()} → ${fullURL}`,
      config.data || config.params || '',
    );
    return config;
  });
}

// ➜ Attach access-token to every request
api.interceptors.request.use(config => {
  const state = store.getState();
  const access = state.auth.accessToken;
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

/**
 * Automatic refresh-token flow.
 *  1. If a 401 arrives, pause the original request.
 *  2. Call /auth/refresh-token with the persisted refreshToken.
 *  3. On success: update Redux, replay the original request.
 *  4. On failure: force logout.
 */
let isRefreshing = false;
let queued = [];

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    // already retried? -> give up
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      // enqueue while another refresh is in flight
      return new Promise((resolve, reject) => {
        queued.push({resolve, reject});
      })
        .then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        })
        .catch(Promise.reject);
    }

    try {
      isRefreshing = true;
      const state = store.getState();
      const rt = state.auth.refreshToken;
      const {data} = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken: rt,
      });

      // data -> {access_token, refresh_token}
      store.dispatch(refreshTokenFulfilled(data));
      queued.forEach(p => p.resolve(data.access_token));
      queued = [];

      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch (e) {
      queued.forEach(p => p.reject(e));
      store.dispatch(logout());
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);
