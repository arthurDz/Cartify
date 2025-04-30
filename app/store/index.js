import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {mmkvPersistStorage} from './mmkv';
import authReducer from './slices/authSlice.js';
import productReducer from './slices/productSlice';

const persistConfig = {key: 'root', storage: mmkvPersistStorage};
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: gDM => gDM({serializableCheck: false}),
});
export const persistor = persistStore(store);
