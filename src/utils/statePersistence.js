/* eslint-disable no-console */
// Mock localStorage when it is not allowed
import { CrossStorageClient } from 'cross-storage';
let localStorage;
var Storage = new CrossStorageClient(process.env.REACT_APP_PUBLIC);

try {
  localStorage = window.localStorage;
} catch (error) {
  localStorage = {
    getItem: () => undefined,
    setItem: () => {}
  };
}

export const loadState = async key => {
  try {
    // const serializedState = localStorage.getItem(key);
    // console.log('key', key);
    // Storage.getLocalStorage(key).then(res => {
    //   console.log('result', key, res);
    // });
    await Storage.onConnect();
    const res = await Storage.get(key);
    console.log('res', JSON.parse(res));

    // if (!serializedState) {
    //   return undefined;
    // }
    return JSON.parse(res);
  } catch (error) {
    console.log('error', key, error);
    return undefined;
  }
};

export const saveState = async (state, key) => {
  try {
    const serializedState = state ? JSON.stringify(state) : '';
    await Storage.onConnect();
    Storage.set(key, serializedState);
    // localStorage.setItem(key, serializedState);
    //Storage.setLocalStorage({key: key, value: serializedState})
  } catch (error) {
    console.warn(`Error saving Redux state: ${error}`);
  }
};

export const getToken = () => loadState('accessToken');
