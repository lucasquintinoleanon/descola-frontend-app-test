import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as abilitiesActions } from '../../reducers/abilities';
import { get, getOne, getAll } from '../../api/abilities';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';

function* getAbilities(action) {
  try {
    const offset = action.payload;
    const response = yield call(get, offset);
    const abilities = snakeToCamel(response?.data?.data);
    const total = snakeToCamel(response?.data?.meta.total);
    yield put(
      abilitiesActions.setAbilities({
        allIds: getAllIds(abilities),
        byId: getById(abilities),
        total
      })
    );
  } catch (error) {
    yield put(abilitiesActions.error(error));
  }
}

function* getAbility(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(getOne, id);
    const ability = snakeToCamel(response?.data?.data);
    yield put(abilitiesActions.setAbility(id, { ...ability }));
  } catch (error) {
    yield put(abilitiesActions.error(error));
  }
}

function* getAllAbilities() {
  try {
    const response = yield call(getAll);
    const abilities = snakeToCamel(response?.data?.data);
    yield put(abilitiesActions.setFooterAbilities(abilities));
  } catch (error) {
    yield put(abilitiesActions.error(error));
  }
}

export default function* watchAbilities() {
  yield takeEvery(types.GET_REQUEST, getAbilities);
  yield takeEvery(types.GET_ONE_REQUEST, getAbility);
  yield takeEvery(types.GET_ALL_REQUEST, getAllAbilities);
}
