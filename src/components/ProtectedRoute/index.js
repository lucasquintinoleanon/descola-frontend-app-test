import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { PAGE_HOME, PAGE_LOGIN, ROUTE_HOME } from '../../constants';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector(state => state.user);
  if(!currentUser?.email) window.location.href = ROUTE_HOME
  return <Route {...rest} render={props => (currentUser?.email ? <Component {...props} /> : <Redirect to={PAGE_LOGIN} />)} />;
};

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default ProtectedRoute;
