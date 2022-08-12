const NAME = 'ADDRESS';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  SET_ADDRESS: `${NAME}/SET_ADDRESS`,
  CHANGE_ADDRESS_REQUEST: `${NAME}/CHANGE_ADDRESS_REQUEST`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: zip => ({ type: types.GET_REQUEST, payload: zip }),
  setAddress: address => ({ type: types.SET_ADDRESS, payload: address }),
  changeAddressRequest: address => ({ type: types.CHANGE_ADDRESS_REQUEST, payload: address }),
  changeAddressSuccess: () => ({ type: types.CHANGE_ADDRESS_SUCCESS }),
  error: error => ({ type: types.ERROR, error })
};

export const initialState = {
  isFetching: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.CHANGE_ADDRESS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.CHANGE_ADDRESS_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case types.GET_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.SET_ADDRESS:
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
