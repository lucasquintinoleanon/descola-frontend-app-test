const NAME = 'CATEGORIES';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  GET_ONE_REQUEST: `${NAME}/GET_ONE_REQUEST`,
  SET_CATEGORIES: `${NAME}/SET_CATEGORIES`,
  SET_CATEGORY: `${NAME}/SET_CATEGORY`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: () => ({ type: types.GET_REQUEST }),
  getOneRequest: id => ({ type: types.GET_ONE_REQUEST, payload: id }),
  setCategories: categories => ({ type: types.SET_CATEGORIES, payload: categories }),
  setCategory: (id, payload) => ({ type: types.SET_CATEGORY, payload: { id, ...payload } }),
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
    case types.SET_CATEGORIES:
      return {
        ...state,
        ...payload,
        isFetching: false
      };
    case types.SET_CATEGORY: {
      const { id } = payload;
      const currentCategory = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentCategory,
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
