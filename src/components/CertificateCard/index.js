import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { actions as watchActions } from '../../reducers/watch';
import { BASE_URL_CERTIFICATE, TYPE_POST_ACTIVITY_CERTIFICATE } from '../../constants';

const CertificateCard = ({ certificate }) => {
  const dispatch = useDispatch();
  const {
    course: { slug, primaryImage, title, subtitle, description },
    certificateHash
  } = certificate;

  const handleSetCertificateWatched = id => {
    const activity = {
      enrollmentId: id,
      contentId: null,
      type: TYPE_POST_ACTIVITY_CERTIFICATE,
      time: 1
    };
    dispatch(watchActions.postRequest(slug, activity));
  };

  return (
    <div className="Certificate__card">
      <div className="Certificate__card__img">
        <img src={primaryImage} alt="Thumbnail curso" />
      </div>
      <div className="Certificate__card__content">
        <h3>{title}</h3>
        <p>{subtitle || description}</p>
        <a
          className="btn btn-block btn-dark"
          rel="noopener noreferrer"
          target="_blank"
          href={`${BASE_URL_CERTIFICATE}${certificateHash}`}
          onClick={() => handleSetCertificateWatched(certificate.id)}
        >
          Ver certificado
        </a>
      </div>
    </div>
  );
};

CertificateCard.propTypes = {
  certificate: PropTypes.shape({
    certificateHash: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    course: PropTypes.shape({
      id: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
      primaryImage: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      description: PropTypes.string
    }).isRequired
  }).isRequired
};

export default CertificateCard;
