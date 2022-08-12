import { call, put, takeEvery, all, select } from 'redux-saga/effects';
import { types, actions as purchasesActions } from '../../reducers/purchases';
import { actions as cartActions } from '../../reducers/cart';
import { actions as modalActions } from '../../reducers/modal';
import { get, getOne, postOrder, jsonFormatOrder } from '../../api/purchases';
import snakeToCamel from '../../utils/snakeToCamel';
import { getAllIds, getById } from '../../utils/responseData';
import { saveState } from '../../utils/statePersistence';
import { PAGE_HOME, PAGE_ORDER, CREDITS } from '../../constants';

function* getPurchases(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(get, id);
    const purchases = snakeToCamel(response?.data?.data);
    yield put(
      purchasesActions.setPurchases({
        allIds: getAllIds(purchases),
        byId: getById(purchases)
      })
    );
  } catch (error) {
    yield put(purchasesActions.error(error));
  }
}

function* getPurchase(action) {
  try {
    const {
      payload: { id }
    } = action;
    const response = yield call(getOne, id);
    const purchase = snakeToCamel(response?.data?.data);
    yield put(purchasesActions.setPurchase(id, { ...purchase }));
  } catch (error) {
    const {
      payload: { history }
    } = action;
    yield put(purchasesActions.error(error));
    history.push(PAGE_HOME);
  }
}

function* createOrder(action) {
  try {
    const { cart, history } = action.payload;
    const response = yield call(postOrder, jsonFormatOrder(cart));
    window.dataLayer.push({
      'event': 'purchase',
      'ecommerce': {
        'purchase': {
          'actionField': {
            'id': response.data?.data?.id,
            'affiliation': 'Descola',
            'revenue': cart.payment.type === CREDITS ? 0 : cart.cart.grandTotal,
            'coupon': cart.cart.coupon?.title || ''
          },
          'products': cart.cart.products.map(product => ({
            'name': product.title,
            'id': product.productId,
            'price': (product.prices?.salePrice || product.prices?.price) - (product.prices?.discount || 0),
            'brand': 'Descola',
            'quantity': 1
          }))
        }
      }
    });
    const purchase = snakeToCamel(response.data.data);
    yield all([
      put(purchasesActions.setPurchase(purchase.id, { ...purchase, paymentFrontType: cart?.payment?.type })),
      put(cartActions.resetCart())
    ]);
    const updatedCart = yield select(state => state.cart);
    saveState(updatedCart, 'cart');
    yield put(modalActions.setCartModalIsOpen(false));
    history.push(`${PAGE_ORDER}/${purchase.id}`);
  } catch (error) {
    yield put(purchasesActions.error(error));
  }
}

export default function* watchPurchases() {
  yield takeEvery(types.GET_REQUEST, getPurchases);
  yield takeEvery(types.GET_ONE_REQUEST, getPurchase);
  yield takeEvery(types.CREATE_ORDER_REQUEST, createOrder);
}
