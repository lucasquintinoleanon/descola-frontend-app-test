import API from '../api';

export const get = () => API.get('v1/products?favorites=true');

export const patch = id => API.patch(`v1/products/${id}/items`, id);

export const toggle = id => API.post('v1/users/favorites', {
  'course_id': id
});
