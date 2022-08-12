import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as pressOfficeActions } from '../../reducers/pressOffice';
import { postPressOffice } from '../../api/pressOffice';
import snakeToCamel from '../../utils/snakeToCamel';

function* sendForm(action) {
  try {
    const formPressOffice = action.payload;
    const response = yield call(postPressOffice, formPressOffice);
    const responseData = snakeToCamel(response?.data?.data);
    yield put(pressOfficeActions.set({ ...responseData, responsePressOffice: 'Email enviado com sucesso' }));
  } catch (error) {
    yield put(pressOfficeActions.error(error));
  }
}

export default function* watchPressOffice() {
  yield takeEvery(types.REQUEST, sendForm);
}
