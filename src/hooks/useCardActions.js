import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import urljoin from 'url-join';
import { actions as modalActions } from '../reducers/modal';
import { actions as cartActions } from '../reducers/cart';
import { PAGE_WATCH } from '../constants';

const useCardActions = path => {
  const history = useHistory();
  const dispatch = useDispatch();
  const setCartModalIsOpen = bool => dispatch(modalActions.setCartModalIsOpen(bool));
  const setAuthModalIsOpen = bool => dispatch(modalActions.setAuthModalIsOpen(bool));
  const currentUser = useSelector(state => state.user);

  const handleWatch = id => {
    if (!currentUser?.email) {
      setAuthModalIsOpen(true);
      return;
    }
    history.push(`${PAGE_WATCH}/${id}`);
  };

  const handleAddToCart = (id, position, list) => {
    setCartModalIsOpen(true);
    dispatch(cartActions.addRequest({ id, position, list }));
  };

  const handleOpenCourse = (course, position, list) => {
    if (position) {
      window.dataLayer.push({
        'event': 'productClick',
        'ecommerce': {
          'click': {
            'actionField': { 'list': list },
            'products': [
              {
                'name': course.title,
                'id': course.id,
                'price': course.prices?.salePrice || course.prices?.price,
                'brand': 'Descola',
                'position': position
              }
            ]
          }
        }
      });
    }
    history.push(urljoin(path, course.slug));
  };

  return {
    handleWatch,
    handleAddToCart,
    handleOpenCourse
  };
};

export default useCardActions;
