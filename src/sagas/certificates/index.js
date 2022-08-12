import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as certificatesActions } from '../../reducers/certificates';
import { get, getOne } from '../../api/certificates';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';

function* getCertificates() {
  try {
    const response = yield call(get);
    const certificates = snakeToCamel(response?.data?.data);
    yield put(
      certificatesActions.setCertificates({
        allIds: getAllIds(certificates),
        byId: getById(certificates)
      })
    );
  } catch (error) {
    yield put(certificatesActions.error(error));
  }
}

function* getCertificate(action) {
  try {
    const { payload: { id } } = action;
    const response = yield call(getOne, id);
    const certificate = snakeToCamel(response?.data?.data);
    yield put(certificatesActions.setCertificate(id, { ...certificate }));
  } catch (error) {
    yield put(certificatesActions.error(error));
  }
}

export default function* watchCertificates() {
  yield takeEvery(types.GET_REQUEST, getCertificates);
  yield takeEvery(types.GET_ONE_REQUEST, getCertificate);
}
