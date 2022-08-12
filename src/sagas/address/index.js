import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as addressActions } from '../../reducers/address';
import { actions as userActions } from '../../reducers/user';
import {
  getUserInfo
} from '../../api/users';
import { saveState } from '../../utils/statePersistence';
import { get, changeAddress as changeAddressApi, createAddress as createAddressApi, jsonFormatAddress } from '../../api/address';
import snakeToCamel from '../../utils/snakeToCamel';

function* getAddress(action) {
  try {
    const { payload } = action;
    const response = yield call(get, payload);
    yield put(
      addressActions.setAddress(response.data)
    );
  } catch (error) {
    yield put(addressActions.error(error));
  }
}


function* changeAddress(action) {
  try {
    const { payload } = action;
    yield put(userActions.set({ messageAddressSuccess: '' }));
    if (payload.id) {
      yield call(changeAddressApi, payload.id, jsonFormatAddress(payload));
    } else {
      yield call(createAddressApi, jsonFormatAddress(payload));
    }
    const userResponse = yield call(getUserInfo);
    const user = snakeToCamel(userResponse?.data.data);
    yield put(userActions.set({ ...user, messageAddressSuccess: 'Endereço alterado com sucesso.' }));
    saveState(user, 'user');

    yield put(
      addressActions.changeAddressSuccess()
    );
  } catch (error) {
    yield put(addressActions.error(error));
  }
}

export default function* watchAddress() {
  yield takeEvery(types.GET_REQUEST, getAddress);
  yield takeEvery(types.CHANGE_ADDRESS_REQUEST, changeAddress);
}
