const NAME = 'ABILITIES';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  GET_ONE_REQUEST: `${NAME}/GET_ONE_REQUEST`,
  GET_ALL_REQUEST: `${NAME}/GET_ALL_REQUEST`,
  SET_ABILITIES: `${NAME}/SET_ABILITIES`,
  SET_ABILITY: `${NAME}/SET_ABILITY`,
  SET_FOOTER_ABILITIES: `${NAME}/SET_FOOTER_ABILITIES`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: offset => ({ type: types.GET_REQUEST, payload: offset }),
  getOneRequest: id => ({ type: types.GET_ONE_REQUEST, payload: id }),
  getAllRequest: () => ({ type: types.GET_ALL_REQUEST }),
  setAbilities: abilities => ({ type: types.SET_ABILITIES, payload: abilities }),
  setAbility: (id, payload) => ({ type: types.SET_ABILITY, payload: { id, ...payload } }),
  setFooterAbilities: abilities => ({ type: types.SET_FOOTER_ABILITIES, payload: abilities }),
  error: error => ({ type: types.ERROR, error })
};

const initialState = {
  byId: {},
  allIds: [],
  footer: [],
  total: 0,
  isFetching: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_REQUEST:
    case types.GET_ONE_REQUEST:
    case types.GET_ALL_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.SET_ABILITIES:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...payload.byId
        },
        allIds: [...new Set([...state.allIds, ...payload.allIds])],
        total: payload.total,
        isFetching: false
      };
    case types.SET_ABILITY: {
      const { id } = payload;
      const currentAbility = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentAbility,
            ...payload
          }
        },
        isFetching: false
      };
    }
    case types.SET_FOOTER_ABILITIES:
      return {
        ...state,
        footer: payload,
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
