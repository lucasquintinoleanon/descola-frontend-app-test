import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { parse } from 'query-string';
import { actions as userActions } from '../../reducers/user';
import snakeToCamel from '../../utils/snakeToCamel';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  // useEffect(() => {
  //   const onLoadPage = () => {
  //     const accessToken = snakeToCamel(parse(location?.search));
  //     dispatch(userActions.loginPartners({ accessToken, history }));
  //   };
  //   onLoadPage();
  // }, [dispatch, location, history]);

  return <>Loading...</>;
};

export default Login;
