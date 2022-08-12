import { combineReducers } from 'redux';
import abilities from './abilities';
import address from './address';
import attachments from './attachments';
import blogPosts from './blogPosts';
import cart from './cart';
import categories from './categories';
import certificates from './certificates';
import contact from './contact';
import courses from './courses';
import favorites from './favorites';
import feedback from './feedback';
import pressOffice from './pressOffice';
import purchases from './purchases';
import testimonials from './testimonials';
import user from './user';
import watch from './watch';
import modal from './modal';

const reducers = combineReducers({
  abilities,
  address,
  attachments,
  blogPosts,
  cart,
  categories,
  certificates,
  contact,
  courses,
  favorites,
  feedback,
  modal,
  pressOffice,
  purchases,
  testimonials,
  user,
  watch
});

export default reducers;
