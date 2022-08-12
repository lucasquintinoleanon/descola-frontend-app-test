const NAME = 'PURCHASES';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  GET_ONE_REQUEST: `${NAME}/GET_ONE_REQUEST`,
  SET_PURCHASES: `${NAME}/SET_PURCHASES`,
  SET_PURCHASE: `${NAME}/SET_PURCHASE`,
  CREATE_ORDER_REQUEST: `${NAME}/CREATE_ORDER_REQUEST`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: id => ({ type: types.GET_REQUEST, payload: id }),
  getOneRequest: payload => ({ type: types.GET_ONE_REQUEST, payload }),
  setPurchases: purchases => ({ type: types.SET_PURCHASES, payload: purchases }),
  setPurchase: (id, payload) => ({ type: types.SET_PURCHASE, payload: { id, ...payload } }),
  createOrderRequest: (cart, history) => ({ type: types.CREATE_ORDER_REQUEST, payload: { cart, history } }),
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
    case types.CREATE_ORDER_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.GET_ONE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.SET_PURCHASES:
      return {
        ...state,
        ...payload,
        isFetching: false
      };
    case types.SET_PURCHASE: {
      const { id } = payload;
      const currentPurchase = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentPurchase,
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
