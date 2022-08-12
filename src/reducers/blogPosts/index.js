const NAME = 'BLOG_POSTS';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  GET_ONE_REQUEST: `${NAME}/GET_ONE_REQUEST`,
  SET_BLOG_POSTS: `${NAME}/SET_BLOG_POSTS`,
  SET_BLOG_POST: `${NAME}/SET_BLOG_POST`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: () => ({ type: types.GET_REQUEST }),
  getOneRequest: id => ({ type: types.GET_ONE_REQUEST, payload: id }),
  setBlogPosts: blogPosts => ({ type: types.SET_BLOG_POSTS, payload: blogPosts }),
  setBlogPost: (id, payload) => ({ type: types.SET_BLOG_POST, payload: { id, ...payload } }),
  error: error => ({ type: types.ERROR, error })
};

const initialState = {
  byId: {},
  allIds: [],
  isFetching: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.GET_ONE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.SET_BLOG_POSTS:
      return {
        ...state,
        ...payload,
        isFetching: false
      };
    case types.SET_BLOG_POST: {
      const { id } = payload;
      const currentBlogPost = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentBlogPost,
            ...payload
          }
        },
        isFetching: false
      };
    }
    case types.ERROR:
      return {
        ...state,
        ...payload,
        isFetching: false
      };
    default:
      return state;
  }
};
