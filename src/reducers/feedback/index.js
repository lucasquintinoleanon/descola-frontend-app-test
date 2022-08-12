const NAME = 'FEEDBACK';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  ANSWER_REQUEST: `${NAME}/ANSWER_REQUEST`,
  SET_FEEDBACK: `${NAME}/SET_FEEDBACK`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: id => ({ type: types.GET_REQUEST, payload: id }),
  answerRequest: (id, itemId, content) => ({ type: types.ANSWER_REQUEST, payload: { id, itemId, content } }),
  setFeedback: feedback => ({ type: types.SET_FEEDBACK, payload: feedback }),
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
    case types.ANSWER_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.SET_FEEDBACK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...payload.byId
        },
        allIds: [...new Set([...state.allIds, ...payload.allIds])],
        isFetching: false
      };
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
