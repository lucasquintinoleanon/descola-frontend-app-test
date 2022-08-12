import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Footer from '../../descola-frontend-components/Footer';
import CourseCard from '../../descola-frontend-components/CourseCard';
import TrackCard from '../../descola-frontend-components/TrackCard';
import BundleCard from '../../descola-frontend-components/BundleCard';
import { actions as favoriteActions } from '../../reducers/favorites';
import { actions as modalActions } from '../../reducers/modal';
import CourseCardLoader from '../../descola-frontend-components/CourseCard/loader';
import { TYPE_TRACKS, TYPE_BUNDLES, TYPE_COURSES } from '../../constants';
import Head from '../../descola-frontend-components/Head';

const MyFavorites = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const coursesAllIds = useSelector(state => state.favorites.allIds);
  const coursesById = useSelector(state => state.favorites.byId);
  const isFetching = useSelector(state => state.favorites.isFetching);

  const setCartModalIsOpen = bool => dispatch(modalActions.setCartModalIsOpen(bool));

  useEffect(() => {
    dispatch(favoriteActions.getRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('coursesAllIds', coursesAllIds)
    const coursesList = coursesAllIds?.map(key => coursesById?.[key]);
    setCourses(coursesList);
  }, [coursesAllIds, coursesById]);

  const handleFavorite = id => {
    dispatch(favoriteActions.toggleFavoriteRequest({ id }));
  };

  const tracks = courses?.filter(c => c.type === TYPE_TRACKS && c.favorite);
  const bundles = courses?.filter(c => c.type === TYPE_BUNDLES && c.favorite);

  return (
    <>
      <Head title="Meus Favoritos" />
      <div className="main index">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-12 mb-60">
                <h1>
                  Meus <span className="primary">Favoritos</span>
                </h1>
              </div>
            </div>
          </div>
        </section>
        <section className="cursosFavoritos">
          <div className="container">
            <div className="row">
              {!isFetching && courses?.filter(c => c.type === TYPE_COURSES && c.favorite).length > 0 && (
                <div className="col-12">
                  <div className="title-bar">
                    <h1 className="border-l primary">Cursos favoritos</h1>
                  </div>
                </div>
              )}
              {!isFetching && courses.length === 0 && (
                <div className="col-12">
                  <div className="alert-empty">Personalize esta página favoritando os cursos que mais gostar!</div>
                </div>
              )}

              {isFetching
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
                    <div key={id} className="col-12 col-sm-6 col-lg-3">
                      <CourseCardLoader />
                    </div>
                  ))
                : courses
                    ?.filter(c => c.type === TYPE_COURSES && c.favorite)
                    .map((course, index) => (
                      <div key={course.id} className="col-12 col-sm-6 col-lg-3">
                        <CourseCard
                          setCartModalIsOpen={setCartModalIsOpen}
                          course={course}
                          onFavorite={handleFavorite}
                          position={index + 1}
                          list="Página de favoritos"
                        />
                      </div>
                    ))}
            </div>
          </div>
        </section>
        {tracks?.length > 0 && (
          <section className="trilhasFavoritas">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="title-bar">
                    <h1 className="border-l secondary">Trilhas favoritas</h1>
                  </div>
                </div>

                {isFetching
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
                      <div key={id} className="col-12 col-sm-6 col-lg-3">
                        <CourseCardLoader />
                      </div>
                    ))
                  : tracks
                      ?.filter(c => c.favorite)
                      .map((course, index) => (
                        <div key={course.id} className="col-12 col-sm-6 col-lg-3">
                          <TrackCard
                            setCartModalIsOpen={setCartModalIsOpen}
                            course={course}
                            onFavorite={handleFavorite}
                            position={index + 1}
                            list="Página de favoritos"
                          />
                        </div>
                      ))}
              </div>
            </div>
          </section>
        )}
        {bundles?.length > 0 && (
          <section className="pacotesFavoritos">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="title-bar">
                    <h1 className="border-l tertiary">Pacotes favoritos</h1>
                  </div>
                </div>
                {isFetching
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
                      <div key={id} className="col-12 col-sm-6 col-lg-3">
                        <CourseCardLoader />
                      </div>
                    ))
                  : bundles
                      ?.filter(c => c.favorite)
                      .map((course, index) => (
                        <div key={course.id} className="col-12 col-sm-6 col-lg-3">
                          <BundleCard
                            setCartModalIsOpen={setCartModalIsOpen}
                            course={course}
                            onFavorite={handleFavorite}
                            position={index + 1}
                            list="Página de favoritos"
                          />
                        </div>
                      ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer type='private' />
    </>
  );
};

export default MyFavorites;
