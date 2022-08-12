const NAME = 'CONTACT';

export const types = {
  REQUEST: `${NAME}/REQUEST`,
  SET: `${NAME}/SET`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  request: formContact => ({ type: types.REQUEST, payload: formContact }),
  set: payload => ({ type: types.SET, payload }),
  error: error => ({ type: types.ERROR, error })
};

const initialState = {
  responseContact: '',
  isFetching: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.SET:
      return {
        ...state,
        ...payload,
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
