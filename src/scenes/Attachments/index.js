import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions as attachmentsActions } from '../../reducers/attachments';
import { actions as modalActions } from '../../reducers/modal';
import { callToastError } from '../../utils/callToast';

const Attachments = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(state => state.user);
  const attachment = useSelector(state => state.attachments?.attachment);
  const errorMessage = useSelector(state => state.attachments?.message);
  const setAuthModalIsOpen = bool => dispatch(modalActions.setAuthModalIsOpen(bool));

  useEffect(() => {
    const onLoadPage = () => {
      dispatch(attachmentsActions.getOneRequest({ id, history }));
    };
    onLoadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onLoadAttachment = () => {
      if (attachment?.url) {
        window.location.replace(attachment.url);
      } else if (errorMessage && !currentUser?.id) {
        callToastError('Por favor, faça login para baixar o arquivo');
        setAuthModalIsOpen(true);
      }
    };
    onLoadAttachment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachment, errorMessage]);

  return <div className="text-center">{errorMessage || 'Aguarde...'}</div>;
};

export default Attachments;
