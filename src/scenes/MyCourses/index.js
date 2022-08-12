import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import Footer from '../../descola-frontend-components/Footer';
import OwnedCourseCard from '../../descola-frontend-components/OwnedCourseCard';
import FeedbackSurvey from '../../components/FeedbackSurvey';
import { actions as coursesActions } from '../../reducers/courses';
import { actions as modalActions } from '../../reducers/modal';
import {
  ORDER_LAST_WATCHED,
  ORDER_COMPLETED,
  ORDER_MOST_RECENT,
  ORDER_TRACKS,
  ORDER_COURSES,
  ORDER_FAVORITES,
  PAGE_WATCH,
  TYPE_TRACK_ON_WATCH,
  TYPE_COURSE_ON_WATCH,
  PAGE_COURSES,
  BASE_URL_CDN
} from '../../constants';
import CourseCardLoader from '../../descola-frontend-components/CourseCard/loader';
import Head from '../../descola-frontend-components/Head';
import CourseCard from '../../descola-frontend-components/CourseCard';

const lupa = `${BASE_URL_CDN}app/assets/images/lupa.svg`;

const MyCourses = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(state => state.user);
  const purchasedCourses = useSelector(state => state.courses.purchased);
  const isFetching = useSelector(state => state.courses.isFetching);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [purchasedCoursesFiltered, setPurchasedCoursesFiltered] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [startNow, setStartNow] = useState([]);
  const [search, setSearch] = useState('');
  const [filterWord, setFilterWord] = useState('');
  const [disabledFilter, setDisabledFilter] = useState(true);
  const surveyClosedState = useState(false);

  const purchasedTracks = purchasedCourses.allIds
    .filter(courseId => {
      const track = purchasedCourses.byId[courseId];
      return track.type === TYPE_TRACK_ON_WATCH ? track : null;
    })
    .map(id => {
      const track = purchasedCourses.byId[id];
      return track;
    });
  const completedCourses = purchasedCourses.allIds.reduce(
    (prev, curr) => prev + Number(purchasedCourses.byId[curr].progress === 100),
    0
  );

  const feedbackSurveys = useMemo(() => purchasedCourses.allIds.filter((id) => {
    const course = purchasedCourses.byId[id];
    return course.progress === 100 && (course.feedbackStatus === 1 || course.feedbackStatus === 2);
  }), [purchasedCourses]);

  const setCartModalIsOpen = bool => dispatch(modalActions.setCartModalIsOpen(bool));
  const loadedPurchasedCourses = typeof purchasedCourses.credits === 'number';

  useEffect(() => {
    const onLoadPage = () => {
      const { id } = currentUser;
      dispatch(coursesActions.getPurchasedRequest({ id }));
    };
    onLoadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const onLoadPurchasedCourses = () => {
      if (!purchasedCourses.allIdsNotTrack.length && loadedPurchasedCourses && !purchasedCourses.highlighted.allIds.length) {
        dispatch(coursesActions.getHighlightedRequest());
      }
      setPurchasedCoursesFiltered(purchasedCourses.allIdsNotTrack);
      if (purchasedCourses.allIdsNotTrack.length > 0) {
        setDisabledFilter(false);
      }
      if (!purchasedCourses.keepWatching.length && purchasedCourses.allIdsNotTrack.length) {
        const arrayAllCourses = purchasedCourses.allIdsNotTrack.map(id => purchasedCourses.byId[id]);
        const orderedCourses = [...arrayAllCourses].sort((a, b) => a.type - b.type);
        setStartNow([{ enrollmentId: orderedCourses[0].id }]);
      }
    };
    onLoadPurchasedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasedCourses]);

  const filter = () => {
    const filteredByWord = filterWord
      ? purchasedCourses.allIdsNotTrack.filter(id => {
          const course = purchasedCourses.byId[id];
          return course.course.title?.toLowerCase().includes(filterWord) ||
            course.course.subtitle?.toLowerCase().includes(filterWord)
            ? course.id
            : null;
        })
      : purchasedCourses.allIdsNotTrack;
    setPurchasedCoursesFiltered(filteredByWord);
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

  const orderCourses = () => {
    const arrayAllCourses = purchasedCoursesFiltered.map(id => purchasedCourses.byId[id]);
    switch (selectedOrder) {
      case ORDER_LAST_WATCHED: {
        const orderedCourses = [...arrayAllCourses].sort((a, b) => b.launchDate - a.launchDate);
        setMyCourses(orderedCourses.map(doc => doc.id));
        setMyCourses(purchasedCoursesFiltered);
        return;
      }
      case ORDER_COMPLETED: {
        const orderedCourses = [...arrayAllCourses].sort((a, b) => b.progress - a.progress);
        setMyCourses(orderedCourses.map(doc => doc.id));
        return;
      }
      case ORDER_MOST_RECENT: {
        const coursesWithDateTime = arrayAllCourses.map(enrollment => ({
          ...enrollment,
          date: new Date(enrollment.createdAt)
        }));
        const orderedCourses = [...coursesWithDateTime].sort((a, b) => b.date - a.date);
        setMyCourses(orderedCourses.map(doc => doc.id));
        return;
      }
      case ORDER_TRACKS: {
        const orderedCourses = [...arrayAllCourses].sort((a, b) => {
          if (a.type === b.type || (a.type !== TYPE_TRACK_ON_WATCH && b.type !== TYPE_TRACK_ON_WATCH)) {
            return a.course.title.localeCompare(b.course.title);
          }
          if (a.type === TYPE_TRACK_ON_WATCH) {
            return -1;
          }
          if (b.type === TYPE_TRACK_ON_WATCH) {
            return 1;
          }
          return 0;
        });

        setMyCourses(orderedCourses.map(doc => doc.id));
        return;
      }
      case ORDER_COURSES: {
        const orderedCourses = [...arrayAllCourses].sort((a, b) => {
          if (a.type === b.type || (a.type !== TYPE_COURSE_ON_WATCH && b.type !== TYPE_COURSE_ON_WATCH)) {
            return a.course.title.localeCompare(b.course.title);
          }
          if (a.type === TYPE_COURSE_ON_WATCH) {
            return -1;
          }
          if (b.type === TYPE_COURSE_ON_WATCH) {
            return 1;
          }
          return 0;
        });

        setMyCourses(orderedCourses.map(doc => doc.id));
        return;
      }
      case ORDER_FAVORITES: {
        const orderedCourses = [...arrayAllCourses].sort((a, b) => {
          const leftHas = a?.course?.favorite;
          const rightHas = b?.course?.favorite;
          if (leftHas === rightHas) {
            return a.course.title.localeCompare(b.course.title);
          }
          if (leftHas) {
            return -1;
          }
          if (rightHas) {
            return 1;
          }
          return 0;
        });
        setMyCourses(orderedCourses.map(doc => doc.id));
        return;
      }
      default: {
        setMyCourses(purchasedCoursesFiltered);
      }
    }
  };

  useEffect(() => {
    const onFilterOrOrderChanged = () => {
      orderCourses();
    };
    onFilterOrOrderChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasedCoursesFiltered, selectedOrder]);

  return (
    <>
      <Head title="Meus Cursos" />
      <div className="main index">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-12 mb-2">
                <h1>
                  Olá, <span className="primary">{currentUser.firstName}</span>
                  <br />
                  Bem vind@ de volta :)
                </h1>
                {purchasedCourses.allIds.length > 0 && (
                  <p className="text-lg">
                    Você tem <span className="primary">{purchasedCourses.allIds.length}</span> curso
                    {purchasedCourses.allIds.length === 1 ? '' : 's'} conosco,{' '}
                    {completedCourses === 0 ? (
                      <>mas ainda não completou nenhum deles</>
                    ) : (
                      <>
                        e já completou <span className="primary">{completedCourses}</span> deles
                      </>
                    )}
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        {feedbackSurveys.length > 0 && (
          <section className="mb-60 survey__home py-3">
            <FeedbackSurvey
              feedbackSurveys={feedbackSurveys}
              surveyClosedState={surveyClosedState}
            />
          </section>
        )}
        <section className="continue">
          <div className="container">
            <div className="row">
              {purchasedCourses.allIdsNotTrack.length > 0 && (
                <div className="col-12">
                  <div className="title-bar">
                    <h1 className="border-l primary">
                      {purchasedCourses.keepWatching.length ? 'Continue Assistindo' : 'Comece Agora'}
                    </h1>
                  </div>
                </div>
              )}
              {(purchasedCourses.keepWatching.length ? purchasedCourses.keepWatching : startNow).map(({ enrollmentId }) => {
                const enrollment = purchasedCourses.byId[enrollmentId];
                // PROBLEM: there's an enrollment id on keepwatching array
                // from a course that's not in purchased courses

                const course = enrollment?.course;
                if (!course) {
                  return null;
                }
                return (
                  <div key={enrollmentId} className="col-12 col-lg-6">
                    <div className="course__card-big">
                      <div
                        className="course__card-big__img"
                        onClick={() =>
                          !course.preOrder
                          ? history.push(
                              `${PAGE_WATCH}/${purchasedCourses.byId[enrollment.trackEnrollmentId]?.course.slug || course.slug}`
                            )
                          : course.slug && history.push(course.slug)
                        }
                      >
                        <img src={course.primaryImage} alt="Thumbnail curso" />
                      </div>
                      <div className="course__card-big__content">
                        {course.preOrder ? (
                          <div className="progress-box" style={{ flexWrap: 'wrap' }}>
                            Em produção
                            <div className="progress">
                              <div className="progress-bar" role="progressbar" style={{ width: `${0}%` }} />
                            </div>
                          </div>
                        ) : (
                          <div className="progress-box">
                            <div className="progress">
                              <div className="progress-bar" role="progressbar" style={{ width: `${enrollment.progress || 0}%` }} />
                            </div>
                            <span className="text-xxs primary">{enrollment.progress?.toFixed(2) || 0}%</span>
                          </div>
                        )}
                        <button
                          disabled={course.preOrder}
                          className="btn btn-sm btn-dark"
                          onClick={() =>
                            history.push(
                              `${PAGE_WATCH}/${purchasedCourses.byId[enrollment.trackEnrollmentId]?.course.slug || course.slug}`
                            )
                          }
                        >
                          Ir pra aula
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="minhas-trilhas">
          <div className="container">
            {purchasedTracks.length > 0 && (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="title-bar">
                      <h1 className="border-l secondary">Minhas Trilhas</h1>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {purchasedTracks.map(track => (
                    <div key={track.id} className="col-12 col-sm-6 col-lg-3">
                      <OwnedCourseCard course={{ ...track.course, progress: track.progress }} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
        <section className="licencas">
          <div className="container">
            {purchasedCourses.licenses?.length > 0 && (
              <div className="row">
                <div className="col-12">
                  <div className="title-bar">
                    <h1 className="border-l primary">Cursos oferecidos pela sua empresa</h1>
                  </div>
                </div>
              </div>
            )}
            <div className="row search__results">
              {purchasedCourses.licenses?.map((license, index) => (
                <div key={JSON.stringify(license)} className="col-12 col-sm-6 col-lg-3">
                  <CourseCard
                    course={license?.product}
                    setCartModalIsOpen={setCartModalIsOpen}
                    position={index + 1}
                    list="Página de Meus Cursos"
                    company={license?.company}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="meus-cursos">
          <div className="container">
            {purchasedCourses.allIdsNotTrack.length > 0 && (
              <div className="row">
                <div className="col-12">
                  <div className="title-bar">
                    <h1 className="border-l primary">Meus Cursos</h1>
                  </div>
                </div>
              </div>
            )}
            <div className="row meus-cursos__search">
              <div className="col-md-8 col-lg-9">
                <div className="checkbox-tag--group">
                  <span className="checkbox-tag--group__label">Priorizar por</span>
                  {/* <span className="checkbox-tag">
                    <input
                      type="radio"
                      name="filter"
                      id="tag-6"
                      onClick={() => setSelectedOrder(ORDER_LAST_WATCHED)}
                      disabled={disabledFilter}
                    />
                    <label htmlFor="tag-6">Útimos assistidos</label>
                  </span> */}
                  <span className="checkbox-tag">
                    <input
                      type="radio"
                      name="filter"
                      id="tag-7"
                      onClick={() => setSelectedOrder(ORDER_COMPLETED)}
                      disabled={disabledFilter}
                    />
                    <label htmlFor="tag-7">Concluídos</label>
                  </span>
                  <span className="checkbox-tag">
                    <input
                      type="radio"
                      name="filter"
                      id="tag-8"
                      onClick={() => setSelectedOrder(ORDER_MOST_RECENT)}
                      disabled={disabledFilter}
                    />
                    <label htmlFor="tag-8">Mais recentes</label>
                  </span>
                  {/* <span className="checkbox-tag">
                    <input
                      type="radio"
                      name="filter"
                      id="tag-9"
                      onClick={() => setSelectedOrder(ORDER_TRACKS)}
                      disabled={disabledFilter}
                    />
                    <label htmlFor="tag-9">Trilhas</label>
                  </span> */}
                  <span className="checkbox-tag">
                    <input
                      type="radio"
                      name="filter"
                      id="tag-10"
                      onClick={() => setSelectedOrder(ORDER_COURSES)}
                      disabled={disabledFilter}
                    />
                    <label htmlFor="tag-10">Cursos</label>
                  </span>
                  <span className="checkbox-tag">
                    <input
                      type="radio"
                      name="filter"
                      id="tag-11"
                      onClick={() => setSelectedOrder(ORDER_FAVORITES)}
                      disabled={disabledFilter}
                    />
                    <label htmlFor="tag-11">Favoritos</label>
                  </span>
                </div>
              </div>
              <div className="col-md-4 col-lg-3">
                <div className="search__bar">
                  <input
                    className=""
                    type="text"
                    placeholder="Procure um curso"
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                    onKeyPress={handleKeyPress}
                    disabled={disabledFilter}
                  />
                  <button className="btn btn-icon" onClick={() => setFilterWord(search.toLowerCase())} disabled={disabledFilter}>
                    <img src={lupa} alt="Pesquisar" />
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              {!isFetching && myCourses.length === 0 && loadedPurchasedCourses && (
                <div className="col-12">
                  <div className="alert-empty">
                    Ops. Parece que você ainda não tem nenhum curso. Que tal escolher um dos cursos abaixo?{' '}
                    <a className="btn btn-primary" href={PAGE_COURSES}>
                      Veja todos os nossos cursos
                    </a>
                  </div>
                  <div className="row">
                    {purchasedCourses.highlighted.allIds.slice(0, 4).map((id, index) => {
                      const highlightedCourse = purchasedCourses.highlighted.byId[id];
                      return (
                        <div key={id} className="col-12 col-sm-6 col-lg-3">
                          <CourseCard course={highlightedCourse} setCartModalIsOpen={setCartModalIsOpen} position={index + 1} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {isFetching
                ? [1, 2, 3, 4].map(id => (
                    <div key={id} className="col-12 col-sm-6 col-lg-3">
                      <CourseCardLoader />
                    </div>
                  ))
                : myCourses.map(id => {
                    const course = purchasedCourses.byId[id];
                    return (
                      <div key={id} className="col-12 col-sm-6 col-lg-3">
                        <OwnedCourseCard course={{ ...course.course, progress: course.progress }} />
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

export default MyCourses;
