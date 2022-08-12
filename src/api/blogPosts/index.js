import API from '../api';

export const get = () => API.get('v1/blog/posts');

export const getOne = id => API.get(`v1/blog/posts/${id}`);
