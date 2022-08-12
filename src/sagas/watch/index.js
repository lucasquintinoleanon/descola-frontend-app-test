import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as watchActions } from '../../reducers/watch';
import { getOne, postActivities, jsonFormatActivity, getEnrollment } from '../../api/watch';
import { PAGE_HOME } from '../../constants';
import snakeToCamel from '../../utils/snakeToCamel';

function* getWatch(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(getOne, id);
    const watch = snakeToCamel(response?.data?.data);
    yield put(watchActions.setWatch(id, { ...watch }));
  } catch (error) {
    const {
      payload: { history }
    } = action;
    yield put(watchActions.error(error));
    history.push(PAGE_HOME);
  }
}

function* postWatch(action) {
  try {
    const { watchId, activity } = action.payload;
    const response = yield call(postActivities, jsonFormatActivity(activity));
    const enrollment = snakeToCamel(response?.data?.data);
    yield put(watchActions.postSuccess(watchId, enrollment));
  } catch (error) {
    yield put(watchActions.error(error));
  }
}

function* selectCourseWatch(action) {
  try {
    const { watchId, enrollmentId } = action.payload;
    const response = yield call(getEnrollment, enrollmentId);
    const watch = snakeToCamel(response?.data?.data);
    yield put(watchActions.selectCourse(watchId, watch));
  } catch (error) {
    yield put(watchActions.error(error));
  }
}

export default function* watchWatch() {
  yield takeEvery(types.GET_REQUEST, getWatch);
  yield takeEvery(types.POST_REQUEST, postWatch);
  yield takeEvery(types.SELECT_COURSE_REQUEST, selectCourseWatch);
}
