import React, { Suspense, useEffect, useState } from 'react';
import { loadProgressBar } from 'axios-progress-bar';
import { Switch, Redirect } from 'react-router-dom';
import urljoin from 'url-join';
import { ToastContainer } from 'react-toastify';
import LoaderRoute from './descola-frontend-components/LoaderRoute';
import Header from './descola-frontend-components/Header';
import CookieBar from './descola-frontend-components/CookieBar';
import api from './api/api';
import {
  PAGE_ERROR,
  PAGE_MY_COURSES,
  PAGE_MY_FAVORITES,
  PAGE_WATCH,
  PAGE_SOCIAL_RETURN,
  PAGE_MY_CERTIFICATES,
  PAGE_MY_PURCHASES,
  PAGE_MY_PROFILE,
  PAGE_ORDER,
  PAGE_CONTENT_SLUG,
  PAGE_ATTACHMENTS,
  PAGE_LOGIN
} from './constants';

import 'react-toastify/dist/ReactToastify.css';
import { loadState } from './utils/statePersistence';
import { actions as userActions } from './reducers/user';
import { actions as cartActions } from './reducers/cart';
import { actions as modalActions } from './reducers/modal';
import { useDispatch } from 'react-redux';

const ErrorPage = React.lazy(() => import('./scenes/Error'));
const SocialReturn = React.lazy(() => import('./scenes/SocialReturn'));
const MyProfile = React.lazy(() => import('./scenes/MyProfile'));
const MyCourses = React.lazy(() => import('./scenes/MyCourses'));
const MyFavorites = React.lazy(() => import('./scenes/MyFavorites'));
const MyCertificates = React.lazy(() => import('./scenes/MyCertificates'));
const Order = React.lazy(() => import('./scenes/Order'));
const MyPurchases = React.lazy(() => import('./scenes/MyPurchases'));
const Attachments = React.lazy(() => import('./scenes/Attachments'));
const Watch = React.lazy(() => import('./scenes/Watch'));
const LoginPage = React.lazy(() => import('./scenes/Login'));


loadProgressBar(null, api);

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const loadStates = async () => {
      const user = await loadState('user');
      const cart = await loadState('cart');
      const modal = await loadState('modal');
      dispatch(userActions.set(user));
      dispatch(cartActions.set(cart));
      dispatch(modalActions.set(modal));
      setLoaded(true);
    };
    loadStates();
  }, []);

  return (
    <>
      <Header type='private' />
      <ToastContainer />
      {loaded && (
        <Suspense fallback={<div></div>}>
          <Switch>
            <LoaderRoute path={`${PAGE_SOCIAL_RETURN}`} component={SocialReturn} />
            <LoaderRoute path={PAGE_MY_PROFILE} component={MyProfile} protected />
            <LoaderRoute path={PAGE_MY_FAVORITES} component={MyFavorites} protected />
            <LoaderRoute path={PAGE_MY_CERTIFICATES} component={MyCertificates} protected />
            <LoaderRoute path={PAGE_MY_PURCHASES} component={MyPurchases} protected />
            <LoaderRoute path={`${PAGE_ORDER}/:id`} component={Order} protected />
            <LoaderRoute path={`${PAGE_ATTACHMENTS}/:id`} component={Attachments} />
            <LoaderRoute path={`${PAGE_WATCH}/:id`} component={Watch} protected />
            <LoaderRoute path={PAGE_ERROR} component={ErrorPage} />
            <LoaderRoute path={PAGE_LOGIN} component={LoginPage} />
            <LoaderRoute path={PAGE_MY_COURSES} component={MyCourses} protected />
            <Redirect to={PAGE_ERROR} />
          </Switch>
        </Suspense>
      )}
      <CookieBar />
    </>
  );
};

export default App;
