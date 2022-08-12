import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { actions as purchasesActions } from '../../reducers/purchases';

import Footer from '../../descola-frontend-components/Footer';
import Head from '../../descola-frontend-components/Head';
import ScrollToTop from '../../descola-frontend-components/ScrollToTop';
import {
  PAGE_HOME,
  PAGE_MY_COURSES,
  CREDIT_CARD,
  BOLETO,
  CREDITS,
  STATUS_PAID,
  STATUS_WAITING_PAYMENT,
  STATUS_REFUSED,
  STATUS_CANCELLED,
  STATUS_PROCESSING,
  STATUS_AUTHORIZED,
  BASE_URL_CDN
} from '../../constants';

const pagamento = `${BASE_URL_CDN}app/assets/images/pagamento.png`;

const Order = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const order = useSelector(state => state.purchases.byId[id]);
  const [flagCheckOrder, setFlagCheckOrder] = useState(false);
  const [messageStatus, setMessageStatus] = useState({
    one: false,
    two: false,
    three: false,
    four: false
  });
  const timerApiCall = useRef(false);
  const paymentType = order?.paymentFrontType || order?.payments[0]?.type;
  const checkPaymentCreditCard = order?.payments?.length === 0 || order?.payments[0]?.status === STATUS_PROCESSING;
  const checkPaymentBoleto = order?.payments?.length === 0 || order?.payments[0]?.status === STATUS_WAITING_PAYMENT;
  const checkPaymentCredits = order?.payments?.length === 0;
  const cancelApiCall =
    order?.payments[0]?.status === STATUS_REFUSED ||
    order?.payments[0]?.status === STATUS_CANCELLED ||
    order?.payments[0]?.status === STATUS_PAID ||
    (paymentType !== BOLETO && order?.payments[0]?.status === STATUS_AUTHORIZED);
  const orderComplete =
    order?.payments[0]?.status === STATUS_PAID || (paymentType !== BOLETO && order?.payments[0]?.status === STATUS_AUTHORIZED);

  useEffect(() => {
    const onLoadPage = () => {
      setMessageStatus({ ...messageStatus, one: true });
      dispatch(purchasesActions.getOneRequest({ id, history }));
    };
    onLoadPage();
    return () => {
      clearInterval(timerApiCall.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onLoadOrder = () => {
      if (
        ((paymentType === CREDIT_CARD && checkPaymentCreditCard) ||
          (paymentType === BOLETO && checkPaymentBoleto) ||
          (paymentType === CREDITS && checkPaymentCredits)) &&
        !flagCheckOrder
      ) {
        timerApiCall.current = setInterval(() => dispatch(purchasesActions.getOneRequest({ id, history })), 1000);
        setFlagCheckOrder(true);
      }
      if (cancelApiCall || (paymentType === BOLETO && order?.payments[0]?.status === STATUS_WAITING_PAYMENT)) {
        clearInterval(timerApiCall.current);
      }
      if ((order?.payments[0]?.status === STATUS_WAITING_PAYMENT || orderComplete) && !messageStatus.two) {
        setMessageStatus({ ...messageStatus, two: true });
      }
      if (orderComplete && messageStatus.two && !messageStatus.three) {
        setMessageStatus({ ...messageStatus, three: true });
      }
    };
    onLoadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const renderMessagePurchase = {
    [CREDIT_CARD]: (
      <>
        <h2>Seu pagamento está sendo processado. Acompanhe abaixo!</h2>
        <p>Você pode sair dessa página se preferir. Enviaremos um email assim que o pagamento estiver completo.</p>
      </>
    ),
    [CREDITS]: <h2>Pedido efetuado, aguarde enquanto trocando seus créditos.</h2>,
    [BOLETO]: <h2>Pedido efetuado. Imprima o boleto clicando no link abaixo.</h2>
  };

  const renderMessageStatusOne = {
    [CREDIT_CARD]: 'Transação autorizada',
    [BOLETO]: 'Pedido efetuado',
    [CREDITS]: 'Pedido efetuado'
  };

  const renderMessageStatusTwo = {
    [CREDIT_CARD]: 'Processando pagamento',
    [BOLETO]: 'Aguardando pagamento',
    [CREDITS]: 'Trocando os créditos'
  };

  const renderMessageStatusThree = {
    [CREDIT_CARD]: 'Pagamento completo',
    [BOLETO]: 'Pagamento identificado',
    [CREDITS]: 'Adicionando cursos'
  };

  const renderMessageStatusFour = {
    [CREDIT_CARD]: 'Bom curso!',
    [BOLETO]: 'Bom curso!',
    [CREDITS]: 'Bom curso!'
  };

  return (
    <>
      <ScrollToTop />

      <Head title="Pedidos" />
      <div className="main">
        <div className="container">
          <div className="row mb-40">
            <div className="col-12">
              <h1>
                Acompanhe <span className="primary">seu pedido</span>
              </h1>
            </div>
            <div className="col-12 col-md-6">
              <img src={pagamento} alt="Pagamento" />
            </div>
            <div className="col-12 col-md-6">
              {order?.payments[0]?.status === STATUS_REFUSED || order?.payments[0]?.status === STATUS_CANCELLED ? (
                <h2>Ops, tivemos um problema com o pagamento. Tente novamente ou entre em contato conosco pelo chat.</h2>
              ) : (
                renderMessagePurchase[paymentType]
              )}
              <div className="order-steps">
                <div className={classNames('order-steps__item', { 'order-steps__item--active': messageStatus.one })}>
                  <div className="order-steps__item__number">1</div>
                  <p>{renderMessageStatusOne[paymentType]}</p>
                </div>
                <div
                  className={classNames('order-steps__item', {
                    'order-steps__item--active': messageStatus.two
                  })}
                  onAnimationEnd={() =>
                    (order?.payments[0]?.status === STATUS_PAID || order?.payments[0]?.status === STATUS_AUTHORIZED) &&
                    setMessageStatus({ ...messageStatus, three: true })
                  }
                >
                  <div className="order-steps__item__number">2</div>
                  <p>{renderMessageStatusTwo[paymentType]}</p>
                </div>
                <div
                  className={classNames('order-steps__item', { 'order-steps__item--active': messageStatus.three })}
                  onAnimationEnd={() => setMessageStatus({ ...messageStatus, four: true })}
                >
                  <div className="order-steps__item__number">3</div>
                  <p>{renderMessageStatusThree[paymentType]}</p>
                </div>
                <div className={classNames('order-steps__item', { 'order-steps__item--active': messageStatus.four })}>
                  <div className="order-steps__item__number">4</div>
                  <p>{renderMessageStatusFour[paymentType]}</p>
                </div>
              </div>
              <div className="buttons-bar text-left">
                {paymentType === BOLETO && order?.payments[0]?.bankSlip && (
                  <a className="btn btn-primary" rel="noopener noreferrer" target="_blank" href={order?.payments[0]?.bankSlip || '/#'}>
                    Visualizar boleto
                  </a>
                )}
                <div className="btn btn-outline-primary" onClick={() => history.push(PAGE_MY_COURSES)}>
                  Ir para meus cursos
                </div>
                <div className="btn btn-dark" onClick={() => history.push(PAGE_HOME)}>
                  Voltar para o site
                </div>
              </div>
            </div>
          </div>
          <div className="row" />
        </div>
      </div>
      <Footer type='private' />
    </>
  );
};

export default Order;
