const NAME = 'CART';

export const types = {
  ADD_REQUEST: `${NAME}/ADD_REQUEST`,
  ADD: `${NAME}/ADD`,
  REMOVE_REQUEST: `${NAME}/REMOVE_REQUEST`,
  REMOVE: `${NAME}/REMOVE`,
  EDIT_REQUEST: `${NAME}/EDIT_REQUEST`,
  RECOVER_REQUEST: `${NAME}/RECOVER_REQUEST`,
  EDIT: `${NAME}/EDIT`,
  PATCH_REQUEST: `${NAME}/PATCH_REQUEST`,
  VALIDATE_COUPON_REQUEST: `${NAME}/VALIDATE_COUPON_REQUEST`,
  VALIDATE_COUPON: `${NAME}/VALIDATE_COUPON`,
  REMOVE_COUPON_REQUEST: `${NAME}/REMOVE_COUPON_REQUEST`,
  RESET_CART: `${NAME}/RESET_CART`,
  ERROR: `${NAME}/ERROR`,
  SET: `${NAME}/SET`
};

export const actions = {
  addRequest: payload => ({ type: types.ADD_REQUEST, payload }),
  add: payload => ({ type: types.ADD, payload }),
  removeRequest: id => ({ type: types.REMOVE_REQUEST, payload: id }),
  remove: id => ({ type: types.REMOVE, payload: { id } }),
  editRequest: payload => ({ type: types.EDIT_REQUEST, payload }),
  recoverRequest: payload => ({ type: types.RECOVER_REQUEST, payload }),
  edit: payload => ({ type: types.EDIT, payload }),
  patchRequest: payload => ({ type: types.PATCH_REQUEST, payload }),
  validateCouponRequest: payload => ({ type: types.VALIDATE_COUPON_REQUEST, payload }),
  validateCoupon: payload => ({ type: types.VALIDATE_COUPON, payload }),
  removeCouponRequest: payload => ({ type: types.REMOVE_COUPON_REQUEST, payload }),
  resetCart: () => ({ type: types.RESET_CART }),
  error: payload => ({ type: types.ERROR, payload }),
  set: cart => ({ type: types.SET, payload: cart })
};

export const initialState = {
  id: '',
  status: '',
  userId: '',
  products: [],
  total: 0,
  grandTotal: 0,
  totalCredits: 0,
  discount: 0,
  coupon: {},
  couponError: '',
  isFetching: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_REQUEST:
    case types.PATCH_REQUEST:
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
    case types.ADD: {
      // const { id } = payload;
      return {
        // ...state,
        ...payload,
        // byId: {
        //   ...state.byId,
        //   [id]: {
        //     ...payload
        //   }
        // },
        // allIds: [...new Set([...state.allIds, id])],
        isFetching: false
      };
    }
    case types.REMOVE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.RECOVER_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.REMOVE: {
      const item = payload;
      const { id } = item;
      return {
        ...state,
        allIds: state.allIds.filter(itemId => itemId !== id),
        byId: Object.keys(state.byId)
          .filter(itemId => parseInt(itemId, 10) !== id)
          .reduce((prev, itemId) => ({ ...prev, [itemId]: state.byId[itemId] }), {}),
        isFetching: false
      };
    }
    case types.EDIT_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.EDIT: {
      const { id } = payload;
      const currentItem = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentItem,
            ...payload
          }
        },
        isFetching: false
      };
    }
    case types.VALIDATE_COUPON_REQUEST:
    case types.REMOVE_COUPON_REQUEST:
      return {
        ...state,
        couponError: '',
        isFetching: true
      };
    case types.VALIDATE_COUPON: {
      return {
        ...state,
        coupon: {},
        isFetching: false
      };
    }
    case types.RESET_CART:
      return initialState;
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
