import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as testimonialsActions } from '../../reducers/testimonials';
import { get, getOne } from '../../api/testimonials';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';

function* getTestimonials() {
  try {
    const response = yield call(get);
    const testimonials = snakeToCamel(response?.data?.data);
    yield put(
      testimonialsActions.setTestimonials({
        allIds: getAllIds(testimonials),
        byId: getById(testimonials)
      })
    );
  } catch (error) {
    yield put(testimonialsActions.error(error));
  }
}

function* getTestimonial(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(getOne, id);
    const testimonial = snakeToCamel(response?.data?.data);
    yield put(testimonialsActions.setTestimonial(id, { ...testimonial }));
  } catch (error) {
    yield put(testimonialsActions.error(error));
  }
}

export default function* watchTestimonials() {
  yield takeEvery(types.GET_REQUEST, getTestimonials);
  yield takeEvery(types.GET_ONE_REQUEST, getTestimonial);
}
