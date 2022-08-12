import { call, put, takeLeading } from 'redux-saga/effects';
import { getFeedbackSurvey, postSurveyAnswer } from '../../api/feedback';
import { types, actions as feedbackActions } from '../../reducers/feedback';
import { getAllIds, getById } from '../../utils/responseData';
import snakeToCamel from '../../utils/snakeToCamel';

function* getFeedback(action) {
  try {
    const { id } = action.payload;
    const response = yield call(getFeedbackSurvey, id);
    const feedback = snakeToCamel(response?.data?.data);
    yield put(feedbackActions.setFeedback({
      allIds: getAllIds(feedback),
      byId: getById(feedback)
    }));
  } catch (error) {
    yield put(feedbackActions.error(error));
  }
}

function* postFeedback(action) {
  try {
    const { id, itemId, content } = action.payload;
    yield call(postSurveyAnswer, id, itemId, content);
    yield put(feedbackActions.setFeedback({
      allIds: [itemId],
      byId: { [itemId]: { id: itemId, content } }
    }));
  } catch (error) {
    yield put(feedbackActions.error(error));
  }
}

export default function* watchFeedback() {
  yield takeLeading(types.GET_REQUEST, getFeedback);
  yield takeLeading(types.ANSWER_REQUEST, postFeedback);
}
