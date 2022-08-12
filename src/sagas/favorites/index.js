import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as favoritesActions } from '../../reducers/favorites';
import { get, patch, toggle as toggleFavoriteCall } from '../../api/favorites';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';


function* getFavorites() {
  try {
    const response = yield call(get);
    const favorites = snakeToCamel(response?.data?.data);
    yield put(
      favoritesActions.setFavorites({
        allIds: getAllIds(favorites),
        byId: getById(favorites)
      })
    );
  } catch (error) {
    yield put(favoritesActions.error(error));
  }
}

function* postFavorites(action) {
  try {
    const formFavorite = action.payload;
    const response = yield call(patch, formFavorite);
    const favorite = snakeToCamel(response?.data?.data);
    yield put(favoritesActions.set(favorite));
  } catch (error) {
    yield put(favoritesActions.error({ error: 'Erro desconhecido, favor tentar novamente' }));
  }
}

function* toggleFavorite(action) {
  const {
    payload: { id }
  } = action;
  yield put(favoritesActions.toggleFavorite({ id }));
  try {
    yield call(toggleFavoriteCall, id);
  } catch (err) {
    yield put(favoritesActions.toggleFavorite({ id }));
  }
}

export default function* watchFavorites() {
  yield takeEvery(types.GET_REQUEST, getFavorites);
  yield takeEvery(types.POST_REQUEST, postFavorites);
  yield takeEvery(types.TOGGLE_FAVORITE_REQUEST, toggleFavorite);
}
