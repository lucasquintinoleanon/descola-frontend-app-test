import API from '../api';

export const get = offset => API.get(`v1/tags${offset ? `?offset=${offset}` : ''}`);

export const getAll = () => API.get('v1/tags?limit=10000');

export const getOne = id => API.get(`v1/tags/${id}`);
