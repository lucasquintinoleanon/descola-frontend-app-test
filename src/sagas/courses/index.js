import { all, call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as coursesActions } from '../../reducers/courses';
import {
  get,
  getMoreQuantity,
  getFromQuery,
  getOneFromProducts,
  getOneFromCourses,
  getRelated,
  getPurchased,
  getOneFromItemProducts,
  getByCategory,
  getWithFilter
} from '../../api/courses';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';
import convertForGTM from '../../utils/convertForGTM';
import { PAGE_HOME, TYPE_TRACK_ON_WATCH } from '../../constants';
import { toggle as toggleFavoriteCall } from '../../api/favorites';

function* getAll() {
  try {
    const response = yield call(get);
    const courses = snakeToCamel(response?.data?.data);
    const total = snakeToCamel(response?.data?.meta.total);
    yield put(
      coursesActions.setCourses({
        allIds: getAllIds(courses),
        byId: getById(courses),
        total
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* getAllWithFilter(action) {
  try {
    const query = Object.keys(action.payload)
      .map(key => `${key}=${action.payload[key]}`)
      .join('&');
    const response = yield call(get, query);
    const courses = snakeToCamel(response?.data?.data);
    const total = snakeToCamel(response?.data?.meta.total);
    yield put(
      coursesActions.setCourses({
        allIds: getAllIds(courses),
        byId: getById(courses),
        total
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* getMore(action) {
  try {
    const { filter, quantity } = action.payload;
    const { type, category, tag, sort, search } = filter;
    const queryArray = [type, category, tag, sort, search].filter(Boolean);
    const query = queryArray.join('&');
    const response = yield call(getMoreQuantity, quantity, query);
    const courses = snakeToCamel(response?.data?.data);
    const total = snakeToCamel(response?.data?.meta.total);
    yield put(
      coursesActions.setMoreCourses({
        allIds: getAllIds(courses),
        byId: getById(courses),
        total
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* getFilter(action) {
  try {
    const { type, category, tag, sort, search } = action.payload;
    const queryArray = [type, category, tag, sort, search].filter(Boolean);
    const query = queryArray.join('&');
    const response = yield call(getWithFilter, query);
    const courses = snakeToCamel(response?.data?.data);
    const total = snakeToCamel(response?.data?.meta.total);
    yield put(
      coursesActions.setCourses({
        allIds: getAllIds(courses),
        byId: getById(courses),
        total
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* search(action) {
  try {
    const query = action.payload;
    const response = yield call(getFromQuery, query);
    const courses = snakeToCamel(response?.data?.data);
    const total = snakeToCamel(response?.data?.meta.total);
    yield put(
      coursesActions.setCourses({
        allIds: getAllIds(courses),
        byId: getById(courses),
        total
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* getCourse(action) {
  try {
    const {
      payload: { id }
    } = action;
    const [responseFromProduct, responseFromCourse, responseRelated] = yield all([
      call(getOneFromProducts, id),
      call(getOneFromCourses, id),
      call(getRelated, id)
    ]);
    const product = snakeToCamel(responseFromProduct?.data?.data);
    const course = snakeToCamel(responseFromCourse?.data?.data);
    const related = snakeToCamel(responseRelated?.data?.data);
    yield put(coursesActions.setCourse(id, { ...course, ...product, related }));
  } catch (error) {
    const {
      payload: { history }
    } = action;
    yield put(coursesActions.error(error));
    history.push(PAGE_HOME);
  }
}

function* getContentBySlug(action) {
  try {
    const {
      payload: { id }
    } = action;
    const [responseFromProduct, responseFromCourse, responseRelated] = yield all([
      call(getOneFromProducts, id),
      call(getOneFromCourses, id),
      call(getRelated, id)
    ]);
    const product = snakeToCamel(responseFromProduct?.data?.data);
    const item = snakeToCamel(responseFromCourse?.data?.data);
    const related = snakeToCamel(responseRelated?.data?.data);
    yield put(coursesActions.setCourse(id, { ...item, ...product, related }));
  } catch (error) {
    const {
      payload: { history }
    } = action;
    yield put(coursesActions.error(error));
    history.push(PAGE_HOME);
  }
}

function* getTrack(action) {
  try {
    const {
      payload: { id }
    } = action;
    const [responseFromProduct, responseFromItemProduct, responseRelated] = yield all([
      call(getOneFromProducts, id),
      call(getOneFromItemProducts, id),
      call(getRelated, id)
    ]);
    const product = snakeToCamel(responseFromProduct?.data?.data);
    const item = snakeToCamel(responseFromItemProduct?.data?.data);
    const related = snakeToCamel(responseRelated?.data?.data);
    yield put(coursesActions.setCourse(id, { ...product, item, related }));
  } catch (error) {
    const {
      payload: { history }
    } = action;
    yield put(coursesActions.error(error));
    history.push(PAGE_HOME);
  }
}

function* getAllPurchased(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(getPurchased, id);
    const responseCamel = snakeToCamel(response?.data?.data);
    const enrollments = snakeToCamel(responseCamel.enrollments);
    const keepWatching = snakeToCamel(responseCamel.keepWatching);
    const credits = snakeToCamel(responseCamel.credits);
    const licenses = snakeToCamel(responseCamel.licenses);
    yield put(
      coursesActions.setCourses({
        purchased: {
          allIds: getAllIds(enrollments),
          byId: getById(enrollments),
          allIdsNotTrack: getAllIds(enrollments.filter(enrollment => enrollment.type !== TYPE_TRACK_ON_WATCH)),
          keepWatching,
          credits,
          licenses
        }
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* getHighlighted() {
  try {
    const response = yield call(getByCategory, 13);
    const highlighted = snakeToCamel(response?.data?.data);
    yield put(
      coursesActions.setCourses({
        purchased: {
          highlighted: {
            allIds: getAllIds(highlighted),
            byId: getById(highlighted)
          }
        }
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* getHome() {
  try {
    const [responseOnSale, responseHighlighted, responseFree, responseTracks] = yield all([
      call(getByCategory, 12),
      call(getByCategory, 13),
      call(getByCategory, 14),
      call(getByCategory, 15)
    ]);
    window.dataLayer.push({
      'event': 'productListing',
      'ecommerce': {
        'currencyCode': 'BRL',
        'impressions': [
          ...convertForGTM(responseHighlighted?.data?.data, 'Cursos em destaque', 1),
          ...convertForGTM(responseOnSale?.data?.data, 'Cursos em promoção', 5),
          ...convertForGTM(responseFree?.data?.data, 'Cursos gratuitos', 7),
          ...convertForGTM(responseTracks?.data?.data, 'Trilhas de cursos', 9)
        ]
      }
    });
    const onSale = snakeToCamel(responseOnSale?.data?.data);
    const free = snakeToCamel(responseFree?.data?.data);
    const highlighted = snakeToCamel(responseHighlighted?.data?.data);
    const tracks = snakeToCamel(responseTracks?.data?.data);
    yield put(
      coursesActions.setCourses({
        home: {
          onSale: {
            allIds: getAllIds(onSale),
            byId: getById(onSale)
          },
          free: {
            allIds: getAllIds(free),
            byId: getById(free)
          },
          highlighted: {
            allIds: getAllIds(highlighted),
            byId: getById(highlighted)
          },
          tracks: {
            allIds: getAllIds(tracks),
            byId: getById(tracks)
          }
        }
      })
    );
  } catch (error) {
    yield put(coursesActions.error(error));
  }
}

function* toggleFavorite(action) {
  const {
    payload: { id }
  } = action;
  yield put(coursesActions.toggleFavorite({ id }));
  try {
    yield call(toggleFavoriteCall, id);
  } catch (err) {
    yield put(coursesActions.toggleFavorite({ id }));
  }
}

export default function* watchCourses() {
  yield takeEvery(types.GET_ALL_REQUEST, getAll);
  yield takeEvery(types.GET_ALL_WITH_FILTER, getAllWithFilter);
  yield takeEvery(types.GET_MORE_REQUEST, getMore);
  yield takeEvery(types.GET_WITH_FILTER, getFilter);
  yield takeEvery(types.SEARCH_REQUEST, search);
  yield takeEvery(types.GET_ONE_REQUEST, getCourse);
  yield takeEvery(types.GET_ONE_BY_SLUG_REQUEST, getContentBySlug);
  yield takeEvery(types.GET_ONE_TRACK_REQUEST, getTrack);
  yield takeEvery(types.GET_PURCHASED_REQUEST, getAllPurchased);
  yield takeEvery(types.GET_HIGHLIGHTED_REQUEST, getHighlighted);
  yield takeEvery(types.GET_HOME_REQUEST, getHome);
  yield takeEvery(types.TOGGLE_FAVORITE_REQUEST, toggleFavorite);
}
