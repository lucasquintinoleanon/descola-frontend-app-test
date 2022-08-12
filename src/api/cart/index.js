import API from '../api';

export const post = payload => API.post('v1/carts', payload);

export const postItem = (id, payload) => API.post(`v1/carts/${id}/items`, payload);

export const get = id => API.get(`/v1/carts/${id}`);

export const del = (id, idItem) => API.delete(`/v1/carts/${id}/items/${idItem}`);

export const patch = id => API.patch(`/v1/carts/${id}`);

export const addCoupon = (id, payload) => API.patch(`/v1/carts/${id}/coupon`, payload);

export const delCoupon = id => API.delete(`/v1/carts/${id}/coupon`);

export const jsonFormatProducts = idProduct => ({ products: [1].map(() => ({
  'product_id': idProduct,
  'quantity': 1
})) });

export const jsonFormatCoupon = coupon => ({
  'coupon_code': coupon
});
