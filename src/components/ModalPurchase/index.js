import React from 'react';
import PropTypes from 'prop-types';
import formatToCurrency from '../../utils/formatToCurrency';
import { TYPE_TRACKS_STRING, TYPE_BUNDLES_STRING, TYPE_COURSES_STRING, TYPE_CREDIT_STRING } from '../../constants';

const ModalPurchase = ({ purchase, setSelectedPurchase }) => {
  const { id, total, payment, shipments } = purchase;

  const typeItem = {
    [TYPE_TRACKS_STRING]: <span className="secondary">Trilha</span>,
    [TYPE_COURSES_STRING]: <span className="primary">Curso</span>,
    [TYPE_BUNDLES_STRING]: <span className="tertiary">Pacote</span>,
    [TYPE_CREDIT_STRING]: <span className="tertiary">Crédito</span>
  };

  return (
    <div className="popup__overlay popup__overlay--top-zero" onClick={() => setSelectedPurchase(null)}>
      <div className="popup__box popup__box--purchase" onClick={e => e.stopPropagation()}>
        <span>Pedido</span>
        <h1>{id}</h1>
        <div className="popup__box--purchase__boxes">
          <div>
            <span>Valor do pedido</span>
            <h2>R$ {formatToCurrency(total)}</h2>
          </div>
          <div>
            <span>Forma de pagamento</span>
            <h2 className="text-sm">{payment?.typeName}</h2>
          </div>
        </div>
        <span>Itens</span>
        <table className="table table-striped">
          <thead className="thead-primary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tipo</th>
              <th scope="col">Nome</th>
              <th scope="col">Valor Unitário</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(shipment =>
              shipment.items.map(item => (
                <tr key={item.id}>
                  <th scope="row">{item.productId}</th>
                  <td>{typeItem[item.typeName]}</td>
                  <td>{item.title}</td>
                  <td>R$ {formatToCurrency(item.unitPrice)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ModalPurchase.propTypes = {
  setSelectedPurchase: PropTypes.func.isRequired,
  purchase: PropTypes.shape({
    id: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    payment: PropTypes.shape({
      typeName: PropTypes.string.isRequired
    }).isRequired,
    shipments: PropTypes.array.isRequired
  }).isRequired
};

export default ModalPurchase;
