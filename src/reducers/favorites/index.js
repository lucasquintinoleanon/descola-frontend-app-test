import * as _ from 'lodash';

const NAME = 'FAVORITES';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  POST_REQUEST: `${NAME}/POST_REQUEST`,
  SET_FAVORITES: `${NAME}/SET_FAVORITES`,
  SET_FAVORITE: `${NAME}/SET_FAVORITE`,
  TOGGLE_FAVORITE_REQUEST: `${NAME}/TOOGLE_FAVORITE_REQUEST`,
  TOGGLE_FAVORITE: `${NAME}/TOOGLE_FAVORITE`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: () => ({ type: types.GET_REQUEST }),
  postRequest: () => ({ type: types.POST_REQUEST }),
  setFavorites: favorites => ({ type: types.SET_FAVORITES, payload: favorites }),
  setFavorite: (id, payload) => ({ type: types.SET_FAVORITE, payload: { id, ...payload } }),
  toggleFavoriteRequest: (id) => ({ type: types.TOGGLE_FAVORITE_REQUEST, payload: id }),
  toggleFavorite: (id) => ({ type: types.TOGGLE_FAVORITE, payload: id }),
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
    case types.TOGGLE_FAVORITE_REQUEST:
    case types.POST_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.SET_FAVORITES:
      return {
        ...state,
        ...payload,
        isFetching: false
      };
    case types.SET_FAVORITE: {
      const { id } = payload;
      const currentFavorite = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentFavorite,
            ...payload
          }
        },
        isFetching: false
      };
    }
    case types.TOGGLE_FAVORITE: {
      const { id } = payload;

      const toggleFavoriteById = (deepState, idx) => {
        const currentItem = _.get(deepState, `byId[${idx}]`);
        if (currentItem) {
          return {
            ...deepState.byId,
            [idx]: {
              ...currentItem,
              favorite: !currentItem.favorite
            }
          };
        }
        return {
          ...deepState.byId
        };
      };
      return {
        ...state,
        byId: toggleFavoriteById(state, id),
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
