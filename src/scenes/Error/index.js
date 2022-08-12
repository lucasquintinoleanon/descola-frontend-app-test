import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import ScrollLock from 'react-scrolllock';
import Footer from '../../descola-frontend-components/Footer';
import ModalPassword from '../../descola-frontend-components/ModalPassword';

import { actions as testimonialsActions } from '../../reducers/testimonials';
import { actions as coursesActions } from '../../reducers/courses';
import { actions as modalActions } from '../../reducers/modal';
import Head from '../../descola-frontend-components/Head';
import { actions as cartActions } from '../../reducers/cart';
import { ROUTE_COURSES } from '../../constants';

const ErrorPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { token } = parse(location?.search);
  const [resetPasswordModalIsOpen, setResetPasswordModal] = useState(false);
  const setCartModalIsOpen = bool => dispatch(modalActions.setCartModalIsOpen(bool));
  useEffect(() => {
    const onLoadPage = () => {
      dispatch(testimonialsActions.getRequest());
      dispatch(coursesActions.getHomeRequest());
      if (token) {
        setResetPasswordModal(true);
      }
    };
    onLoadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const onLoadPage = async () => {
      const { cart } = parse(location.search);
      const queryParams = new URLSearchParams(location.search);

      if (cart) {
        dispatch(cartActions.recoverRequest(cart));
        setCartModalIsOpen(true);
        queryParams.delete('cart');
        history.replace({
          search: queryParams.toString()
        });
      }
    };
    onLoadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <ScrollLock isActive={resetPasswordModalIsOpen} />
      {resetPasswordModalIsOpen && <ModalPassword token={token} setResetPasswordModal={setResetPasswordModal} />}
      <Head title="Erro 404" />
      <div className="main index">
        <section className="mb-60">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="title-bar">
                  <h1 className="border-l primary">Erro 404</h1>
                  <h2>Você se perdeu! <br />Use o menu para encontrar o que procura ou <a href={ROUTE_COURSES}>clique aqui</a>!</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer type='private' />
    </>
  );
};

export default ErrorPage;
