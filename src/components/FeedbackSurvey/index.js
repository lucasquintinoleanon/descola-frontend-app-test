import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { actions as coursesActions } from '../../reducers/courses';
import { actions as feedbackActions } from '../../reducers/feedback';
import { actions as usersActions } from '../../reducers/user';

const questionsTypes = {
  1: 'text',
  2: 'binary',
  3: 'rating',
  4: 'score'
};

const FeedbackSurvey = ({ feedbackSurveys, surveyClosedState, isWatching }) => {
  const dispatch = useDispatch();
  const survey = useSelector(state => state.feedback);
  const currentUser = useSelector(state => state.user);
  const purchasedCourses = useSelector(state => state.courses.purchased);
  const setSurveyClosed = surveyClosedState[1];
  const [surveyActive, setSurveyActive] = useState(false);
  const [surveyFinished, setSurveyFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState(undefined);
  const [gender, setGender] = useState(undefined);
  const [dateOfBirth, setDateOfBirth] = useState({});
  const [hoverAnswer, setHoverAnswer] = useState(0);
  const [currentCourseSurvey, setCurrentCourseSurvey] = useState(() => {
    if (feedbackSurveys.length === 1) {
      return String(feedbackSurveys[0]);
    }
    return undefined;
  });

  const courseWatched = useMemo(() => {
    if (feedbackSurveys.length === 1) {
      return true;
    }
      return false;
  }, [feedbackSurveys]);

  const missingPersonalInfo = useMemo(() => !currentUser.gender || !currentUser.dateOfBirth, [currentUser]);

  const btnSendPersonalInfoEnabled = useMemo(() => {
    const genderSelect = !currentUser.gender === !!gender;
    const birthSelect = !currentUser.dateOfBirth === (!!dateOfBirth.day && !!dateOfBirth.month && !!dateOfBirth.year);
    return genderSelect && birthSelect;
  }, [currentUser, dateOfBirth, gender]);

  const [hasModal, setHasModal] = useState(false);

  useEffect(() => {
    if (isWatching) {
      if (feedbackSurveys.length === 1) {
        setCurrentCourseSurvey(String(feedbackSurveys[0]));
      } else {
        setCurrentCourseSurvey(undefined);
      }
    }
  }, [feedbackSurveys, isWatching]);

  useEffect(() => {
    const checkModal = () => {
      const elem = document.querySelector('.survey__watch');
      setHasModal(!!elem && window.innerWidth <= 992);

      window.addEventListener('resize', () => setHasModal(!!document.querySelector('.survey__watch') && window.innerWidth <= 992));
    };

    checkModal();
  }, []);

  useEffect(() => {
    const blockScroll = () => {
      if (hasModal) {
        document.querySelector('body').style.overflowY = 'hidden';
      } else {
        document.querySelector('body').style.overflowY = 'auto';
      }
    };

    blockScroll();
  }, [hasModal]);

  useEffect(() => {
    let mounted = true;

    const onLoadPage = () => {
        const { id } = currentUser;
        if (mounted) {
          dispatch(coursesActions.getPurchasedRequest({ id }));
        }
    };

    onLoadPage();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, courseWatched]);

  const enableScroll = () => {
    document.querySelector('body').style.overflowY = 'auto';
  };

  const feedbackSurveyAnswered = useMemo(
    () => {
      const isAnswered = purchasedCourses.byId[currentCourseSurvey]?.feedbackStatus === 3;
      if (isAnswered) {
        setSurveyActive(false);
      }
      return isAnswered;
    },
    [purchasedCourses, currentCourseSurvey]);

  const scoreValues = useMemo(() => {
    const answerType = survey.byId[String(currentQuestion)]?.type;

    if (answerType === 3 || answerType === 4) {
      const scoreQuantity = survey.byId[String(currentQuestion)]?.maxScore - survey.byId[String(currentQuestion)]?.minScore + 1;
      const scoreMinValue = survey.byId[String(currentQuestion)]?.minScore;

      return Array.from({ length: scoreQuantity }, (v, i) => i + scoreMinValue);
    }
    return undefined;
  }, [survey, currentQuestion]);

  const dateOptions = useMemo(() => {
    const now = new Date();
    const years = Array.from({ length: 101 }, (v, i) => now.getFullYear() - i);

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const months = Array.from({ length: 12 }, (v, i) => monthNames[i]);

    const daysInMonth = !!dateOfBirth.year && !!dateOfBirth.month
      ? (new Date(dateOfBirth.year, dateOfBirth.month, 0)).getDate()
      : 31;

    const days = Array.from({ length: daysInMonth }, (v, i) => 1 + i);

    return {
      years,
      months,
      days
    };
  }, [dateOfBirth]);

  const unansweredFeedback = useMemo(() => {
    const feedbacksId = survey.allIds.filter(id => survey.byId[id].content === null);
    setCurrentQuestion(feedbacksId[0]);

    return feedbacksId;
  }, [survey]);

  const handleNextFeedback = useCallback(() => {
    dispatch(feedbackActions.answerRequest(currentCourseSurvey, currentQuestion, answer, currentUser.id));

    const { id } = currentUser;
    dispatch(coursesActions.getPurchasedRequest({ id }));

    setAnswer(undefined);
    if (unansweredFeedback[1]) {
      setCurrentQuestion(unansweredFeedback[1]);
    } else if (!missingPersonalInfo) {
      setSurveyFinished(true);
    }
  }, [currentUser, currentQuestion, unansweredFeedback, currentCourseSurvey, answer, dispatch, missingPersonalInfo]);

  const handleSetObjectiveAnswer = useCallback(async (value) => {
    setAnswer(value);
    dispatch(feedbackActions.answerRequest(currentCourseSurvey, currentQuestion, value, currentUser.id));
    setAnswer(undefined);

    const { id } = currentUser;
    dispatch(coursesActions.getPurchasedRequest({ id }));

    if (unansweredFeedback[1]) {
      setCurrentQuestion(unansweredFeedback[1]);
    } else if (!missingPersonalInfo) {
      setSurveyFinished(true);
    }
  }, [currentUser, currentQuestion, unansweredFeedback, currentCourseSurvey, dispatch, missingPersonalInfo]);

  const handleStartSurvey = useCallback(() => {
    dispatch(feedbackActions.getRequest({ id: currentCourseSurvey }));
    setSurveyActive(true);
  }, [currentCourseSurvey, dispatch, setSurveyActive]);

  const handleCloseSurvey = useCallback(() => {
    setCurrentCourseSurvey(undefined);
    setAnswer(undefined);
    setCurrentQuestion(unansweredFeedback[0]);
    setSurveyActive(false);
    enableScroll();
    setSurveyClosed(true);
  }, [setSurveyActive, setSurveyClosed, unansweredFeedback]);

  const handleSelectCourse = useCallback((courseId) => {
    setCurrentCourseSurvey(String(courseId));
  }, []);

  const handleFinishSurvey = useCallback(() => {
    setSurveyFinished(false);
    setSurveyActive(false);
    enableScroll();
    setSurveyClosed(true);
    const { id } = currentUser;
    dispatch(coursesActions.getPurchasedRequest({ id }));

    setCurrentCourseSurvey(undefined);
    setCurrentQuestion(unansweredFeedback[0]);
  }, [setSurveyActive, currentUser, dispatch, setSurveyClosed, unansweredFeedback]);

  const answerType = useMemo(() => ({
    text: (<textarea
      name="message"
      placeholder="Escreva aqui..."
      value={answer}
      maxLength={1000}
      className="question--text"
      onChange={e => setAnswer(e.currentTarget.value)}
    />),

    binary: (<div>
        <span className="checkbox-tag mr-2">
          <input
            type="checkbox"
            id="yes"
            checked={!!answer}
            onChange={() => handleSetObjectiveAnswer(true)}
          />
          <label htmlFor="yes">Sim</label>
        </span>
        <span className="checkbox-tag">
          <input
            type="checkbox"
            id="no"
            checked={!answer && answer !== undefined}
            onChange={() => handleSetObjectiveAnswer(false)}
          />
          <label htmlFor="no">Não</label>
        </span>
      </div>),

      rating: (<>
        {scoreValues && scoreValues.map(score => (
          <span className="star-rating" key={score} style={{ cursor: 'pointer' }} onClick={() => handleSetObjectiveAnswer(score)}>
            {Number(answer) >= score || hoverAnswer >= score ? (
              // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
              <span
                className="star-rating-selected"
                onMouseEnter={() => setHoverAnswer(score)}
                onMouseLeave={() => setHoverAnswer(0)}
              />
            ) : (
            <span
              className="star-rating-unselected"
              onMouseEnter={() => setHoverAnswer(score)}
              onMouseLeave={() => setHoverAnswer(0)}
            />
          )}
          </span>
        ))}
    </>),

    score: (<>
      {scoreValues && scoreValues.map(score => (
        <span className="score mt-2" key={score} style={{ cursor: 'pointer' }} onClick={() => handleSetObjectiveAnswer(score)}>
          {Number(answer) >= score || hoverAnswer >= score ? (
            <span
              className="score-selected"
              onMouseEnter={() => setHoverAnswer(score)}
              onMouseLeave={() => setHoverAnswer(0)}
            >
              {score}
            </span>
          ) : (
            <span
              className="score-unselected"
              onMouseEnter={() => setHoverAnswer(score)}
              onMouseLeave={() => setHoverAnswer(0)}
            >
              {score}
            </span>
          )}
        </span>
      ))}
    </>)
  }), [scoreValues, answer, hoverAnswer, handleSetObjectiveAnswer]);

  const question = useMemo(() => (
    <>
      <div className="container">
        <button className="btn btn-close" onClick={handleCloseSurvey}> </button>
        <div className="row">
          <div className="col-12 survey__content col-10 col-lg-8 py-3 pb-4">
            <div className="survey__content--questions">
            <h3 className="mb-1">Sua experiência com o curso</h3>
            <h2 className="mb-3">{purchasedCourses.byId[currentCourseSurvey]?.course.title}</h2>

            {survey && (
              <>
                <div className="survey__content--questions-item">
                  <p className="text-md mb-1">{survey.byId[String(currentQuestion)]?.title}</p>
                  <p className="text-md mb-2">{survey.byId[String(currentQuestion)]?.subtitle}</p>
                  <span className="d-block">{answerType[questionsTypes[survey.byId[String(currentQuestion)]?.type]]}</span>
                </div>
                <button
                  className="mt-3 btn btn-outline-light"
                  onClick={handleNextFeedback}
                  disabled={answer === undefined}
                >
                  Próxima
                </button>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  ), [answer, answerType, survey, currentQuestion, handleNextFeedback, purchasedCourses, currentCourseSurvey, handleCloseSurvey]);

  const startSurvey = useMemo(() => (
    <>
      {purchasedCourses.byId[currentCourseSurvey] && (
        <div className="container">
          <button className="btn btn-close" onClick={handleCloseSurvey} />
          <div className="row">
            <div className="col-12 survey__content pb-4">
              <h3 className="mb-1">Sua experiência com o curso</h3>
              <h2 className="mb-3">{purchasedCourses.byId[currentCourseSurvey]?.course.title}</h2>
              <div className="course__card__img">
                <img
                  className="survey-img"
                  src={purchasedCourses.byId[currentCourseSurvey]?.course.primaryImage}
                  alt="Thumbnail curso"
                />
              </div>
              <p className="mb-0 mt-3 text-md">Como foi sua experiência com o curso?</p>
              <p>Clique abaixo e responda as perguntas:</p>
              <button
                className="btn btn-outline-light"
                onClick={handleStartSurvey}
              >
                Começar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ), [purchasedCourses, handleStartSurvey, currentCourseSurvey, handleCloseSurvey]);

  const surveyPending = useMemo(() => (
    <>
    <section className="survey__home py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="survey__intro">
            <h2 className="mb-2">Compartilhe sua experiência Descola:</h2>
            <p className="text-lg">
              Você possui <span className="primary">{feedbackSurveys.length}</span> pesquisa
              {feedbackSurveys.length === 1 ? '' : 's'} pendente
              {feedbackSurveys.length === 1 ? '' : 's'}.
            </p>
            {feedbackSurveys.length === 1 ? (
              <button
                className="btn btn-outline-light"
                onClick={() => setCurrentCourseSurvey(String(feedbackSurveys[0]))}
              >
                Responder
              </button>
            ) : (
              <select defaultValue placeholder="Cursos" onChange={e => handleSelectCourse(e.currentTarget.value)}>
                <option disabled value>Selecione um curso</option>
                {feedbackSurveys.map(survey => (
                  <option key={survey} value={survey}>{purchasedCourses.byId[String(survey)].course.title}</option>
                ))}

              </select>
            )}
                </div>
              </div>
            </div>

      </div>
    </section>
    </>
  ), [purchasedCourses, feedbackSurveys, handleSelectCourse]);

  const finishedSurvey = useMemo(() => (
    <>
      <div className="container">
        <button className="btn btn-close" onClick={handleCloseSurvey} />
        <div className="row">
          <div className="survey__content pb-4">
            <h3 className="mb-1">Sua experiência com o curso</h3>
            <h2 className="mb-3">{purchasedCourses.byId[currentCourseSurvey]?.course.title}</h2>
            <button className="btn btn-icon btn-favorite" />

            <p className="text-bold text-lg mb-3">Muito obrigado por compartilhar<br />sua experiência conosco!</p>

            <button className="btn btn-outline-light mt-2" onClick={handleFinishSurvey}>Voltar</button>
          </div>
        </div>
      </div>
    </>
  ), [handleFinishSurvey, purchasedCourses, currentCourseSurvey, handleCloseSurvey]);

  const handleSendPersonalData = useCallback(() => {
    if (!currentUser.gender === !!gender) {
      dispatch(usersActions.setUserGender({ gender }));
    }

    if (!currentUser.dateOfBirth === (!!dateOfBirth.day && !!dateOfBirth.month && !!dateOfBirth.year)) {
      dispatch(usersActions.setUserDateOfBirth(dateOfBirth));
    }

    if (feedbackSurveys.length === 0) {
      handleCloseSurvey();
    } else {
      setSurveyFinished(true);
    }
  }, [feedbackSurveys, handleCloseSurvey, currentUser, gender, dateOfBirth, dispatch]);

  const completePersonalData = useMemo(() => (
    <>
      <div className="container">
        <button className="btn btn-close" onClick={handleCloseSurvey}> </button>
        <div className="row">
          <div className="col-12 survey__content col-10 col-lg-8 py-3 pb-4">
            <div className="survey__content--questions">
            <h2 className="mb-3">Complete seu perfil</h2>
              <div>
                <div className="survey__content__form row">
                  {!currentUser.dateOfBirth && (
                    <div className="col-12">
                      <label htmlFor="">Data de nascimento:</label>
                      <div className="row">
                        <div className="col-sm-3">
                          <select
                            id="day"
                            onChange={(e) => setDateOfBirth({ ...dateOfBirth, day: e.target.value })}
                            defaultValue="nonSelectable"
                          >
                            <option value="nonSelectable" disabled>Dia</option>
                            {dateOptions.days.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-sm-5">
                          <select
                            id="month"
                            onChange={(e) => setDateOfBirth({ ...dateOfBirth, month: e.target.value })}
                            defaultValue="nonSelectable"
                          >
                            <option value="nonSelectable" disabled>Mês</option>
                            {dateOptions.months.map((month, index) => (
                              <option key={month} value={index + 1}>{month}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-sm-4">

                          <select
                            id="year"
                            onChange={(e) => setDateOfBirth({ ...dateOfBirth, year: e.target.value })}
                            defaultValue="nonSelectable"
                          >
                            <option value="nonSelectable" disabled>Ano</option>
                            {dateOptions.years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  {!currentUser.gender && (
                    <div className="col-sm-6">
                      <label htmlFor="genero">Gênero</label>
                      <select
                        id="genero"
                        defaultValue="nonSelectable"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="nonSelectable" disabled>Gênero</option>
                        <option value="2">Feminino</option>
                        <option value="1">Masculino</option>
                        <option value="3">Outros</option>
                      </select>
                    </div>
                  )}
                </div>
                <button
                  className="mt-3 btn btn-outline-light"
                  onClick={handleSendPersonalData}
                  disabled={!btnSendPersonalInfoEnabled}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ), [handleCloseSurvey, handleSendPersonalData, dateOptions, dateOfBirth, currentUser, btnSendPersonalInfoEnabled]);

  if (!isWatching) {
    if (!currentCourseSurvey) {
      return surveyPending;
    }

    if (surveyFinished) {
      return finishedSurvey;
    }

    if (surveyActive) {
      return question;
    }

    if (feedbackSurveyAnswered && missingPersonalInfo) {
      return completePersonalData;
    }

    return startSurvey;
  }

  if (isWatching) {
    if (!courseWatched && missingPersonalInfo) {
      return completePersonalData;
    }

    if (surveyFinished) {
      return finishedSurvey;
    }

    if (surveyActive) {
      return question;
    }

    if (feedbackSurveyAnswered && missingPersonalInfo) {
      return completePersonalData;
    }

    return startSurvey;
  }
};

FeedbackSurvey.propTypes = {
  feedbackSurveys: PropTypes.arrayOf(PropTypes.number).isRequired,
  surveyClosedState: PropTypes.arrayOf(PropTypes.any).isRequired,
  isWatching: PropTypes.bool
};

FeedbackSurvey.defaultProps = {
  isWatching: false
};

export default FeedbackSurvey;
