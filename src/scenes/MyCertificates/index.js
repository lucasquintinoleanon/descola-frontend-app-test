import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Footer from '../../descola-frontend-components/Footer';
import CertificateCard from '../../components/CertificateCard';
import { actions as certificatesActions } from '../../reducers/certificates';
import Head from '../../descola-frontend-components/Head';
import { BASE_URL_CDN } from '../../constants';

const lupa = `${BASE_URL_CDN}app/assets/images/lupa.svg`;

const MyCertificates = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);
  const certificates = useSelector(state => state.certificates);
  const [search, setSearch] = useState('');
  const [filterWord, setFilterWord] = useState('');
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  useEffect(() => {
    const onLoadPage = () => {
      dispatch(certificatesActions.getRequest());
    };
    onLoadPage();
  }, [dispatch]);

  useEffect(() => {
    const onLoadPage = () => {
      setFilteredCertificates(certificates.allIds);
    };
    onLoadPage();
  }, [certificates]);

  const filter = () => {
    const filteredByWord = filterWord
      ? certificates.allIds.filter(id => {
          const certificate = certificates.byId[id];
          return certificate.course.title?.toLowerCase().includes(filterWord) ||
            certificate.course.subtitle?.toLowerCase().includes(filterWord)
            ? certificate.id
            : null;
        })
      : certificates.allIds;
    setFilteredCertificates(filteredByWord);
  };

  useEffect(() => {
    const onFilter = () => {
      filter();
    };
    onFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWord]);

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      setFilterWord(search.toLowerCase());
    }
  };

  return (
    <>
      <Head title="Meus Certificados" />
      <div className="main index">
        <section>
          <div className="container">
            <div className="row mb-60">
              <div className="col-md-8 col-lg-9">
                <h1>
                  Olá <span className="primary">{currentUser.firstName}</span>
                  {filteredCertificates.length === 0 ? (
                    <div>Você ainda não completou nenhum curso conosco :/</div>
                  ) : (
                    <>
                      <br /> Você possui, <span className="primary">{certificates.allIds.length}</span> certificado
                      {certificates.allIds.length !== 1 && 's'}
                    </>
                  )}
                </h1>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                {certificates?.allIds.length > 0 && (
                  <div className="search__bar mt-50">
                    <input
                      type="text"
                      placeholder="Procure um certificado"
                      value={search}
                      onChange={e => setSearch(e.currentTarget.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button className="btn btn-icon" onClick={() => setFilterWord(search.toLowerCase())}>
                      <img src={lupa} alt="Pesquisar" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="certificates  mb-80">
          <div className="container">
            <div className="row">
              {filteredCertificates.map(id => {
                const certificate = certificates.byId[id];
                return (
                  <div key={id} className="col-12 col-sm-6 col-lg-3">
                    <CertificateCard certificate={certificate} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <Footer type='private' />
    </>
  );
};

export default MyCertificates;
