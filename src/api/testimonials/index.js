import API from '../api';

export const get = () => API.get('v1/testimonials');

export const getOne = id => API.get(`v1/testimonials/${id}`);
