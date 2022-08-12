import API from '../api';

export const get = () => API.get('v1/categories');

export const getOne = id => API.get(`v1/categories/${id}`);
