/* eslint-disable camelcase */
import API from '../api';

export const get = () => API.get('v1/categories');

export const postContact = payload => API.post('v1/contact', payload);

export const jsonFormatContact = formContact => ({
  name: formContact.name,
  email: formContact.email,
  phone: formContact.phone,
  subject: formContact.subject,
  message: formContact.message
});
