import Axios from 'axios';
import API from '../api';

export const get = zip => Axios.get(`https://viacep.com.br/ws/${zip}/json`);

export const getOne = id => API.get(`/v1/tags/${id}`);

export const createAddress = (payload) => API.post('/v1/users/addresses', payload);

export const changeAddress = (id, payload) => API.put(`/v1/users/addresses/${id}`, payload);

export const jsonFormatAddress = ({ id, name, zipcode, street, number, complement, neighborhood, city, state, country, recipientName }) => (
  { id,
    name,
    'recipient_name': recipientName,
    zipcode,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    country
  });
