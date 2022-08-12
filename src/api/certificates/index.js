import API from '../api';

export const get = () => API.get('v1/certificates');

export const getOne = id => API.get(`v1/certificates/${id}`);
