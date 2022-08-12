import { takeEvery, select } from 'redux-saga/effects';
import { types } from '../../reducers/modal';

import { saveState } from '../../utils/statePersistence';

function* saveAuthModal(action) {
  const { payload } = action;
  const modal = yield select(state => state.modal);
  saveState({ ...modal, authModalIsOpen: payload }, 'modal');
}
function* saveCartModal(action) {
  const { payload } = action;
  const modal = yield select(state => state.modal);
  saveState({ ...modal, cartModalIsOpen: payload }, 'modal');
}


export default function* watchModals() {
  yield takeEvery(types.SET_AUTH_MODAL_IS_OPEN, saveAuthModal);
  yield takeEvery(types.SET_CART_MODAL_IS_OPEN, saveCartModal);
}
