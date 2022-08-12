import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import formatToCurrency from '../../utils/formatToCurrency';
import { TYPE_CREATED, TYPE_PROCESSING, TYPE_APPROVED, TYPE_COMPLETED, TYPE_CANCELED, TYPE_AUTHORIZED } from '../../constants';

const PurchaseCard = ({ id, purchase, setSelectedPurchase }) => {
  const { statusName, createdAt, total } = purchase;

  const status = {
    [TYPE_CREATED]: 'Feito',
    [TYPE_PROCESSING]: 'Em processamento',
    [TYPE_APPROVED]: 'Aprovado',
    [TYPE_COMPLETED]: 'Completo',
    [TYPE_CANCELED]: 'Cancelado',
    [TYPE_AUTHORIZED]: 'Autorizado'
  };

  return (
    <div className="purchase__card">
      <span>Pedido</span>
      <h1>{id}</h1>
      <span>Data da compra</span>
      <h3>{format(new Date(createdAt), 'dd/MM/yyyy')}</h3>
      <span>Status</span>
      <h3>{status[statusName]}</h3>
      <span>Valor final</span>
      <h2>R$ {formatToCurrency(total)}</h2>
      <button className="btn btn-dark" onClick={() => setSelectedPurchase(id)}>
      Mais Informações
      </button>
    </div>
  );
};

PurchaseCard.propTypes = {
  id: PropTypes.number.isRequired,
  setSelectedPurchase: PropTypes.func.isRequired,
  purchase: PropTypes.shape({
    statusName: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
};

export default PurchaseCard;
