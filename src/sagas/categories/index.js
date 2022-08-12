import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as categoriesActions } from '../../reducers/categories';
import { get, getOne } from '../../api/categories';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';

function* getCategories() {
  try {
    const response = yield call(get);
    const categories = snakeToCamel(response?.data?.data);
    yield put(
      categoriesActions.setCategories({
        allIds: getAllIds(categories),
        byId: getById(categories)
      })
    );
  } catch (error) {
    yield put(categoriesActions.error(error));
  }
}

function* getCategory(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(getOne, id);
    const category = snakeToCamel(response?.data?.data);
    yield put(categoriesActions.setCategory(id, { ...category }));
  } catch (error) {
    yield put(categoriesActions.error(error));
  }
}

export default function* watchCategories() {
  yield takeEvery(types.GET_REQUEST, getCategories);
  yield takeEvery(types.GET_ONE_REQUEST, getCategory);
}
