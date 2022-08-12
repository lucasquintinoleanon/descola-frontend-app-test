import { all, fork } from 'redux-saga/effects';
import watchAbilities from './abilities';
import watchAddress from './address';
import watchAttachments from './attachments';
import watchBlogPosts from './blogPosts';
import watchCart from './cart';
import watchCategories from './categories';
import watchCertificates from './certificates';
import watchContact from './contact';
import watchCourses from './courses';
import watchFavorites from './favorites';
import watchFeedback from './feedback';
import watchPressOffice from './pressOffice';
import watchPurchases from './purchases';
import watchTestimonials from './testimonials';
import watchUser from './user';
import watchWatch from './watch';
import watchModals from './modal';

export default function*() {
  yield all([
    fork(watchAbilities),
    fork(watchAddress),
    fork(watchAttachments),
    fork(watchBlogPosts),
    fork(watchCart),
    fork(watchCategories),
    fork(watchCertificates),
    fork(watchContact),
    fork(watchCourses),
    fork(watchFavorites),
    fork(watchFeedback),
    fork(watchModals),
    fork(watchPressOffice),
    fork(watchPurchases),
    fork(watchTestimonials),
    fork(watchUser),
    fork(watchWatch)
  ]);
}
