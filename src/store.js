import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import { types } from './reducers/user';
import { initialState as initialStateAddress } from './reducers/address';
import { initialState as initialStateCertificates } from './reducers/certificates';
import { initialState as initialStateFavorites } from './reducers/favorites';
import { initialState as initialStatePurchases } from './reducers/purchases';
import { initialState as initialStateWatch } from './reducers/watch';
import { initialState as initialStateCourses } from './reducers/courses';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = (state, action) => {
  if (action.type === types.LOGOUT) {
    return reducers(
      {
        ...state,
        address: initialStateAddress,
        certificates: initialStateCertificates,
        // courses: { ...state.courses,
        //   purchased: {
        //     byId: {},
        //     allIds: [],
        //     keepWatching: []
        //   }
        // },
        courses: initialStateCourses,
        favorites: initialStateFavorites,
        purchases: initialStatePurchases,
        watch: initialStateWatch
      },
      action
    );
  }
  return reducers(state, action);
};


const store = createStore(
  rootReducer,
  {  },
  compose(applyMiddleware(sagaMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f)
);

console.log('store', store);
sagaMiddleware.run(rootSaga);

export default store;
