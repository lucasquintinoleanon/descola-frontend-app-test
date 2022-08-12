/* eslint-disable camelcase */
import API from '../api';

export const postPressOffice = payload => API.post('v1/press-office', payload);

export const jsonFormatContact = formPressOffice => ({
  name: formPressOffice.name,
  email: formPressOffice.email,
  phone: formPressOffice.phone,
  subject: formPressOffice.subject,
  message: formPressOffice.message
});
