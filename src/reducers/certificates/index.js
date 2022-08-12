const NAME = 'CERTIFICATES';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  GET_ONE_REQUEST: `${NAME}/GET_ONE_REQUEST`,
  SET_CERTIFICATES: `${NAME}/SET_CERTIFICATES`,
  SET_CERTIFICATE: `${NAME}/SET_CERTIFICATE`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: () => ({ type: types.GET_REQUEST }),
  getOneRequest: id => ({ type: types.GET_ONE_REQUEST, payload: { id } }),
  setCertificates: certificates => ({ type: types.SET_CERTIFICATES, payload: certificates }),
  setCertificate: (id, payload) => ({ type: types.SET_CERTIFICATE, payload: { id, ...payload } }),
  error: error => ({ type: types.ERROR, error })
};

export const initialState = {
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
    case types.SET_CERTIFICATES:
      return {
        ...state,
        ...payload,
        isFetching: false
      };
    case types.SET_CERTIFICATE: {
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
