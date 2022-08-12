import { call, put, takeEvery, select } from 'redux-saga/effects';

import { types, actions as cartActions } from '../../reducers/cart';
import { initialState as initialStateCourses } from '../../reducers/courses';
import { post, postItem, jsonFormatProducts, jsonFormatCoupon, patch, addCoupon, del, delCoupon, get } from '../../api/cart';
import { callToastError, callToastSuccess } from '../../utils/callToast';
import { saveState } from '../../utils/statePersistence';
import snakeToCamel from '../../utils/snakeToCamel';

function handleAuthState() {
  saveState(initialStateCourses, 'courses');
  window.location.reload();
}

function* add(action) {
  try {
    const { payload } = action;
    const cartId = yield select(state => state.cart.id);
    const response = cartId
      ? yield call(postItem, cartId, jsonFormatProducts(payload.id))
      : yield call(post, jsonFormatProducts(payload.id));
    window.dataLayer.push({
      'event': 'addToCart',
      'ecommerce': {
        'add': {
          'actionField': { 'list': payload.list, 'position': payload.position },
          'products': [
            {
              'name': response?.data?.data.products[0]?.title,
              // eslint-disable-next-line camelcase
              'id': response?.data?.data.products[0]?.product_id,
              // eslint-disable-next-line camelcase
              'price': response?.data?.data.products[0]?.prices?.sale_price || response?.data?.data.products[0]?.prices?.price,
              'brand': 'Descola',
              'quantity': 1
            }
          ]
        }
      }
    });
    const cart = snakeToCamel(response.data.data);
    yield put(cartActions.add(cart));
    window.dataLayer.push({ 'cart': cart });
    const updatedCart = yield select(state => state.cart);
    saveState(updatedCart, 'cart');
  } catch (error) {
    yield put(cartActions.error(error));
  }
}

function* remove(action) {
  try {
    const { payload } = action;
    const cartId = yield select(state => state.cart.id);
    const response = yield call(del, cartId, payload);
    const cart = snakeToCamel(response.data.data);
    yield put(cartActions.add(cart));
    window.dataLayer.push({ 'cart': cart });
    const updatedCart = yield select(state => state.cart);
    saveState(updatedCart, 'cart');
  } catch (error) {
    yield put(cartActions.error(error));
  }
}

function* recover(action) {
  try {
    const { payload } = action;
    const response = yield call(get, payload);
    const cart = snakeToCamel(response.data.data);
    if (cart) {
      yield put(cartActions.add(cart));
      window.dataLayer.push({ 'cart': cart });
      const updatedCart = yield select(state => state.cart);
      saveState(updatedCart, 'cart');
      yield call(handleAuthState);
    }
  } catch (error) {
    yield put(cartActions.error(error));
  }
}

function* update() {
  try {
    const cartId = yield select(state => state.cart.id);
    const response = yield call(patch, cartId);
    const cart = snakeToCamel(response.data.data);
    yield put(cartActions.add(cart));
    window.dataLayer.push({ 'cart': cart });
    const updatedCart = yield select(state => state.cart);
    saveState(updatedCart, 'cart');
    yield call(handleAuthState);
  } catch (error) {
    yield put(cartActions.error(error));
  }
}

// function* edit(action) {
//   try {
//     // const id = action.payload;
//     // const response = yield call(getOne, id);
//     // const course = snakeToCamel(response?.data?.data);
//     // yield put(cartActions.setCourse(id, { ...course }));
//   } catch (error) {
//     yield put(cartActions.error(error));
//   }
// }

function* validateCoupon(action) {
  try {
    const { payload } = action;
    const cartId = yield select(state => state.cart.id);
    const response = yield call(addCoupon, cartId, jsonFormatCoupon(payload));
    const cart = snakeToCamel(response.data.data);
    yield put(cartActions.add(cart));
    callToastSuccess('Cupom aplicado com sucesso!');
    window.dataLayer.push({ 'cart': cart });
    const updatedCart = yield select(state => state.cart);
    saveState(updatedCart, 'cart');
  } catch (error) {
    // eslint-disable-next-line camelcase
    callToastError(error.response?.data?.errors?.coupon_code?.[0]);
    yield put(
      // eslint-disable-next-line camelcase
      cartActions.error({ couponError: error.response.data.error?.message ?? error.response.data?.errors.coupon_code[0] })
    );
  }
}

function* removeCoupon() {
  try {
    const cartId = yield select(state => state.cart.id);
    const response = yield call(delCoupon, cartId);
    const cart = snakeToCamel(response.data.data);
    yield put(cartActions.add(cart));
    window.dataLayer.push({ 'cart': cart });
    const updatedCart = yield select(state => state.cart);
    saveState(updatedCart, 'cart');
  } catch (error) {
    yield put(cartActions.error());
  }
}

export default function* watchCart() {
  yield takeEvery(types.ADD_REQUEST, add);
  yield takeEvery(types.REMOVE_REQUEST, remove);
  yield takeEvery(types.RECOVER_REQUEST, recover);
  yield takeEvery(types.PATCH_REQUEST, update);
  yield takeEvery(types.VALIDATE_COUPON_REQUEST, validateCoupon);
  yield takeEvery(types.REMOVE_COUPON_REQUEST, removeCoupon);
}
