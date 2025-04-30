import {MMKV} from 'react-native-mmkv';

/** One shared MMKV database for the whole app */
export const mmkv = new MMKV();

export const mmkvPersistStorage = {
  setItem: (key, value) => {
    mmkv.set(key, value);
    return Promise.resolve();
  },
  getItem: key => {
    const value = mmkv.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    mmkv.delete(key);
    return Promise.resolve();
  },
};
