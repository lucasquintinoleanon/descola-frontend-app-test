import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import { actions as userActions } from '../../reducers/user';
import snakeToCamel from '../../utils/snakeToCamel';

const SocialReturn = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    const onLoadPage = () => {
      const accessToken = snakeToCamel(parse(location?.search));
      dispatch(userActions.loginSocialRequest(accessToken));
    };
    onLoadPage();
  }, [dispatch, location]);

  return <>Loading...</>;
};

export default SocialReturn;
