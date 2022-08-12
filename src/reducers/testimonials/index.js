const NAME = 'TESTIMONIALS';

export const types = {
  GET_REQUEST: `${NAME}/GET_REQUEST`,
  GET_ONE_REQUEST: `${NAME}/GET_ONE_REQUEST`,
  SET_TESTIMONIALS: `${NAME}/SET_TESTIMONIALS`,
  SET_TESTIMONIAL: `${NAME}/SET_TESTIMONIAL`,
  ERROR: `${NAME}/ERROR`
};

export const actions = {
  getRequest: () => ({ type: types.GET_REQUEST }),
  getOneRequest: id => ({ type: types.GET_ONE_REQUEST, payload: id }),
  setTestimonials: testimonials => ({ type: types.SET_TESTIMONIALS, payload: testimonials }),
  setTestimonial: (id, payload) => ({ type: types.SET_TESTIMONIAL, payload: { id, ...payload } }),
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
    case types.SET_TESTIMONIALS:
      return {
        ...state,
        ...payload,
        isFetching: false
      };
    case types.SET_TESTIMONIAL: {
      const { id } = payload;
      const currentTestimonial = state.byId[id] || {};
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...currentTestimonial,
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
