import React, { useState, useEffect } from 'react';
import ScrollLock from 'react-scrolllock';
import { useDispatch, useSelector } from 'react-redux';

import Footer from '../../descola-frontend-components/Footer';
import PurchaseCard from '../../components/PurchaseCard';
import ModalPurchase from '../../components/ModalPurchase';
import { actions as purchasesActions } from '../../reducers/purchases';
import Head from '../../descola-frontend-components/Head';
import { BASE_URL_CDN } from '../../constants';

const lupa = `${BASE_URL_CDN}app/assets/images/lupa.svg`;

const MyPurchases = () => {
  const dispatch = useDispatch();
  const purchases = useSelector(state => state.purchases);
  const currentUser = useSelector(state => state.user);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [search, setSearch] = useState('');
  const [filterWord, setFilterWord] = useState('');
  const [filteredPurchases, setFilteredPurchases] = useState([]);

  useEffect(() => {
    const onLoadPage = () => {
      dispatch(purchasesActions.getRequest({ id: currentUser.id }));
    };
    onLoadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const onLoadPage = () => {
      setFilteredPurchases(purchases.allIds);
    };
    onLoadPage();
  }, [purchases]);

  const filter = () => {
    const filteredByWord = filterWord
      ? purchases.allIds.filter(id => {
          const purchase = purchases.byId[id];
          return purchase.id.toString().includes(filterWord) ? purchase.id : null;
        })
      : purchases.allIds;
    setFilteredPurchases(filteredByWord);
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
      <ScrollLock isActive={selectedPurchase} />
      {selectedPurchase && (
        <ModalPurchase purchase={purchases.byId[selectedPurchase]} setSelectedPurchase={setSelectedPurchase} />
      )}

      <Head title="Minhas Compras" />
      <div className="main index">
        <section>
          <div className="container">
            <div className="row mb-60">
              <div className="col-md-8 col-lg-9">
                <h1>
                  Olá, <span className="primary">{currentUser.firstName}</span>
                  <br /> Veja suas compras
                </h1>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="search__bar mt-50">
                  <input
                    type="text"
                    placeholder="Procure um pedido"
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="btn btn-icon" onClick={() => setFilterWord(search)}>
                    <img src={lupa} alt="Pesquisar" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="puschases mb-80">
          <div className="container">
            <div className="row">
              {filteredPurchases.length === 0 && (
                <div className="col-12">
                  <div className="alert-empty">Você ainda não tem nenhuma compra. Se estiver com problemas, chama no chat!</div>
                </div>
              )}
              {filteredPurchases.map(id => {
                const purchase = purchases.byId[id];
                return (
                  <div key={id} className="col-12 col-sm-6 col-lg-3">
                    <PurchaseCard id={id} purchase={purchase} setSelectedPurchase={setSelectedPurchase} />
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

export default MyPurchases;
