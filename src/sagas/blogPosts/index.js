import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as blogPostsActions } from '../../reducers/blogPosts';
import { get, getOne } from '../../api/blogPosts';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';

function* getBlogPosts() {
  try {
    const response = yield call(get);
    const blogPosts = snakeToCamel(response?.data.data).slice(0, 3);
    yield put(
      blogPostsActions.setBlogPosts({
        allIds: getAllIds(blogPosts),
        byId: getById(blogPosts)
      })
    );
  } catch (error) {
    yield put(blogPostsActions.error(error));
  }
}

function* getBlogPost(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(getOne, id);
    const blogPost = snakeToCamel(response?.data?.data);
    yield put(blogPostsActions.setBlogPost(id, { ...blogPost }));
  } catch (error) {
    yield put(blogPostsActions.error(error));
  }
}

export default function* watchBlogPosts() {
  yield takeEvery(types.GET_REQUEST, getBlogPosts);
  yield takeEvery(types.GET_ONE_REQUEST, getBlogPost);
}
