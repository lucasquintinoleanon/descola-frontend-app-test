import * as _ from 'lodash';

const NAME = 'COURSES';

export const types = {
  GET_ALL_REQUEST: `${NAME}/GET_ALL_REQUEST`,
  GET_ALL_WITH_FILTER: `${NAME}/GET_ALL_WITH_FILTER`,
  GET_MORE_REQUEST: `${NAME}/GET_MORE_REQUEST`,
  GET_WITH_FILTER: `${NAME}/GET_WITH_FILTER`,
  SEARCH_REQUEST: `${NAME}/SEARCH_REQUEST`,
  GET_ONE_REQUEST: `${NAME}/GET_ONE_REQUEST`,
  GET_ONE_BY_SLUG_REQUEST: `${NAME}/GET_ONE_BY_SLUG_REQUEST`,
  GET_ONE_TRACK_REQUEST: `${NAME}/GET_ONE_TRACK_REQUEST`,
  GET_PURCHASED_REQUEST: `${NAME}/GET_PURCHASED_REQUEST`,
  GET_HIGHLIGHTED_REQUEST: `${NAME}/GET_HIGHLIGHTED_REQUEST`,
  GET_HOME_REQUEST: `${NAME}/GET_HOME_REQUEST`,
  SET_COURSES: `${NAME}/SET_COURSES`,
  SET_MORE_COURSES: `${NAME}/SET_MORE_COURSES`,
  SET_COURSE: `${NAME}/SET_COURSE`,
  ERROR: `${NAME}/ERROR`,
  TOGGLE_FAVORITE_REQUEST: `${NAME}/TOOGLE_FAVORITE_REQUEST`,
  TOGGLE_FAVORITE: `${NAME}/TOOGLE_FAVORITE`
};

export const actions = {
  getAllRequest: () => ({ type: types.GET_ALL_REQUEST }),
  getAllWithFilterRequest: payload => ({ type: types.GET_ALL_WITH_FILTER, payload }),
  getMoreRequest: payload => ({ type: types.GET_MORE_REQUEST, payload }),
  getWithFilter: filter => ({ type: types.GET_WITH_FILTER, payload: filter }),
  searchRequest: query => ({ type: types.SEARCH_REQUEST, payload: query }),
  getOneRequest: id => ({ type: types.GET_ONE_REQUEST, payload: id }),
  getOneBySlugRequest: slug => ({ type: types.GET_ONE_BY_SLUG_REQUEST, payload: slug }),
  getOneTrackRequest: id => ({ type: types.GET_ONE_TRACK_REQUEST, payload: id }),
  getPurchasedRequest: id => ({ type: types.GET_PURCHASED_REQUEST, payload: id }),
  getHomeRequest: () => ({ type: types.GET_HOME_REQUEST }),
  getHighlightedRequest: () => ({ type: types.GET_HIGHLIGHTED_REQUEST }),
  setCourses: courses => ({ type: types.SET_COURSES, payload: courses }),
  setMoreCourses: courses => ({ type: types.SET_MORE_COURSES, payload: courses }),
  setCourse: (id, payload) => ({ type: types.SET_COURSE, payload: { id, ...payload } }),
  toggleFavoriteRequest: id => ({ type: types.TOGGLE_FAVORITE_REQUEST, payload: id }),
  toggleFavorite: id => ({ type: types.TOGGLE_FAVORITE, payload: id }),
  error: error => ({ type: types.ERROR, error })
};

export const initialState = {
  byId: {},
  allIds: [],
  purchased: {
    byId: {},
    allIds: [],
    allIdsNotTrack: [],
    keepWatching: [],
    highlighted: {
      byId: {},
      allIds: []
    },
    isFetching: false
  },
  home: {
    onSale: {
      byId: {},
      allIds: []
    },
    free: {
      byId: {},
      allIds: []
    },
    highlighted: {
      byId: {},
      allIds: []
    },
    tracks: {
      byId: {},
      allIds: []
    },
    isFetching: false
  },
  total: 0,
  isFetching: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SEARCH_REQUEST:
    case types.GET_ONE_REQUEST:
    case types.GET_ONE_BY_SLUG_REQUEST:
    case types.GET_ALL_REQUEST:
    case types.GET_ALL_WITH_FILTER:
    case types.GET_MORE_REQUEST:
    case types.GET_WITH_FILTER:
    case types.GET_ONE_TRACK_REQUEST:
    case types.TOGGLE_FAVORITE_REQUEST:
    case types.GET_PURCHASED_REQUEST:
    case types.GET_HIGHLIGHTED_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case types.GET_HOME_REQUEST:
      return {
        ...state,
        home: {
          ...state.home,
          isFetching: true
        }
      };
    case types.SET_COURSES:
      return {
        ...state,
        ...payload,
        home: {
          ...state.home,
          ...payload.home,
          isFetching: false
        },
        purchased: {
          ...state.purchased,
          ...payload.purchased,
          isFetching: false
        },
        total: payload.total || state.total,
        isFetching: payload.home ? state.isFetching : false
      };

    case types.SET_MORE_COURSES:
      return {
        ...state,
        ...payload,
        allIds: [...state.allIds, ...payload.allIds],
        byId: { ...state.byId, ...payload.byId },
        home: {
          ...state.home,
          ...payload.home,
          isFetching: false
        },
        purchased: {
          ...state.purchased,
          ...payload.purchased,
          isFetching: false
        },
        total: payload.total,
        isFetching: payload.home ? state.isFetching : false
      };
    case types.SET_COURSE: {
      const { id } = payload;
      const currentCourse = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentCourse,
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

      const togglePurchasedFavoriteById = (deepState, idx) => {
        const currentItem = _.find(deepState.byId, value => value?.course?.id === idx);
        if (currentItem) {
          return {
            ...deepState.byId,
            [currentItem.id]: {
              ...currentItem,
              course: {
                ...currentItem.course,
                favorite: !currentItem.course.favorite
              }
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
        home: {
          onSale: {
            ...state?.home?.onSale,
            byId: toggleFavoriteById(state?.home?.onSale, id)
          },
          free: {
            ...state?.home?.free,
            byId: toggleFavoriteById(state?.home?.free, id)
          },
          highlighted: {
            ...state?.home?.highlighted,
            byId: toggleFavoriteById(state?.home?.highlighted, id)
          },
          tracks: {
            ...state?.home?.tracks,
            byId: toggleFavoriteById(state?.home?.tracks, id)
          }
        },
        purchased: {
          ...state?.purchased,
          byId: togglePurchasedFavoriteById(state?.purchased, id)
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
