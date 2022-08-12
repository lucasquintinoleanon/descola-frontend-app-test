import API from '../api';
import APIWithoutProgress from '../apiWithoutProgress';

export const get = id => API.get(`v1/students/${id}/purchases`);

export const getOne = id => APIWithoutProgress.get(`v1/orders/${id}`);

export const postOrder = payload => API.post('/v1/orders', payload);

export const jsonFormatOrder = order => ({
  'address_id': order.addressId,
  'payment': {
    'type': order.payment.type,
    'transaction_id': order.payment.token
  },
  'cart': {
    'id': order.cart.id,
    'status': order.cart.status,
    'user_id': order.cart.userId,
    'products': order.cart.products.map(product => ({
      'id': product.id,
      'product_id': product.productId,
      'title': product.title,
      'primary_image': product.primaryImage,
      'secondary_image': product.secondaryImage,
      'quantity': product.quantity,
      'prices': {
        'price': product.prices.price,
        'sale_price': product.prices.salePrice,
        'credits_price': product.prices.creditsPrice,
        'discount': product.prices.discount
      }
    })),
    'total': order.cart.total,
    'discount': order.cart.discount,
    'grand_total': order.cart.grandTotal,
    'total_credits': order.cart.totalCredits,
    'max_installments': order.cart.maxInstallments,
    'interest_rate': order.cart.interestRate,
    'coupon': {
      'id': order.cart.coupon.id,
      'title': order.cart.coupon.title,
      'type': order.cart.coupon.type,
      'value': order.cart.coupon.value,
      'product_id': order.cart.coupon.productId
    }
  }
});
