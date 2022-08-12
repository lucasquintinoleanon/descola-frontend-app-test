import { call, put, takeEvery, all, select } from 'redux-saga/effects';
import { types, actions as userActions } from '../../reducers/user';
import { actions as cartActions, initialState } from '../../reducers/cart';
import { actions as modalActions } from '../../reducers/modal';
import { initialState as initialStateCourses } from '../../reducers/courses';
import {
  postRegister,
  postLogin,
  getUserInfo,
  postForgotPassword,
  postForgotPasswordReset,
  getForgotPasswordValidity,
  patchChangePassword,
  jsonFormatChangePassword,
  patchChangeProfileImage,
  putChangeUserInfo,
  jsonFormatPersonalInfo,
  patchPreferences,
  jsonFormatPreferences,
  setGender,
  setDateOfBirth
} from '../../api/users';
import { saveState, loadState } from '../../utils/statePersistence';
import snakeToCamel from '../../utils/snakeToCamel';
import { PAGE_HOME, ROUTE_HOME } from '../../constants';

function handleAuthState() {
  saveState(initialStateCourses, 'courses');
  window.location.reload();
}

function* register(action) {
  try {
    const formRegister = action.payload;
    const response = yield call(postRegister, formRegister);
    window.dataLayer.push({
      'event': 'userRegistered',
      'user': response?.data?.data
    });
    const user = snakeToCamel(response?.data?.data);
    yield put(userActions.set(user));
    saveState(user.accessToken, 'accessToken');
    saveState(user, 'user');
    const cart = yield select(state => state.cart);
    if (cart.id) {
      yield put(cartActions.patchRequest(user.id));
    }

    // handle auth reset state
    yield call(handleAuthState);
  } catch (error) {
    yield put(userActions.error({ error: 'E-mail já cadastrado no sistema' }));
  }
}

function* login(action) {
  try {
    const formLogin = action.payload;
    const responseLogin = yield call(postLogin, formLogin);
    const { accessToken } = snakeToCamel(responseLogin?.data);
    saveState(accessToken, 'accessToken');
    const response = yield call(getUserInfo);
    window.dataLayer.push({
      'event': 'userLogged',
      'user': response?.data?.data
    });
    const user = snakeToCamel(response?.data.data);
    yield put(userActions.set(user));
    saveState(user, 'user');
    const cart = yield select(state => state.cart);
    if (cart.id) {
      yield put(cartActions.patchRequest(user.id));
    } else {
      // handle auth reset state
      yield call(handleAuthState);
    }
  } catch (error) {
    yield put(userActions.error({ error: 'E-mail ou senha inválidos' }));
  }
}

function* loginSocialNetwork(action) {
  try {
    const { accessToken } = action.payload;
    saveState(accessToken, 'accessToken');
    const response = yield call(getUserInfo);
    window.dataLayer.push({
      'event': 'userLogged',
      'user': response?.data?.data
    });
    const user = snakeToCamel(response.data.data);
    yield put(userActions.set(user));
    yield put(modalActions.setAuthModalIsOpen(false));
    saveState(user, 'user');
    const cart = yield select(state => state.cart);
    if (cart.id) {
      yield put(cartActions.patchRequest(user.id));
    } else {
      // handle auth reset state
      yield call(handleAuthState);
    }
  } catch (error) {
    yield put(userActions.error(error));
    saveState('', 'accessToken');
  } finally {
    window.close();
  }
}

function* loginPartners(action) {
  try {
    const {
      payload: { accessToken, history }
    } = action;
    saveState(accessToken?.accessToken, 'accessToken');
    const response = yield call(getUserInfo);
    window.dataLayer.push({
      'event': 'userLogged',
      'user': response?.data?.data
    });
    const user = snakeToCamel(response.data.data);
    yield put(userActions.set(user));
    yield put(modalActions.setAuthModalIsOpen(false));
    saveState(user, 'user');
    const cart = yield select(state => state.cart);
    if (cart.id) {
      yield put(cartActions.patchRequest(user.id));
    } else {
      history.push(PAGE_HOME);
    }
  } catch (error) {
    const {
      payload: { history }
    } = action;
    yield put(userActions.error(error));
    saveState('', 'accessToken');
    history.push(PAGE_HOME);
  }
}

function* forgotPassword(action) {
  try {
    const { email } = action.payload;
    yield call(postForgotPassword, { email });
    yield put(userActions.set({ forgotPasswordSuccess: 'Perfeito, enviamos para o seu email um link para recriar a senha.' }));
  } catch (error) {
    yield put(userActions.error({ forgotPassword: 'Não foi encontrado um usuário com esse e-mail.' }));
  }
}

function* checkValidityToken(action) {
  try {
    const { token } = action.payload;
    const response = yield call(getForgotPasswordValidity, token);
    const tokenValidity = snakeToCamel(response.data);
    yield put(userActions.set({ tokenValidity }));
  } catch (error) {
    yield put(userActions.error({ tokenValidity: { error: 'Token não é mais válido. Peça novamente o e-mail.' } }));
  }
}

function* resetPassword(action) {
  try {
    const { payload } = action;
    yield call(postForgotPasswordReset, payload);
    yield put(userActions.set({ tokenValidity: { success: 'Senha alterada com sucesso.' } }));
  } catch (error) {
    yield put(userActions.error(error));
  }
}

function* changePassword(action) {
  try {
    const { payload } = action;
    const response = yield call(patchChangePassword, jsonFormatChangePassword(payload));
    const { accessToken } = snakeToCamel(response.data?.data);
    saveState(accessToken, 'accessToken');
    yield put(userActions.set({ messagePasswordSuccess: 'Senha alterada com sucesso!' }));
  } catch (error) {
    yield put(userActions.error(error));
  }
}

function* changeEmail(action) {
  try {
    const { payload } = action;
    const response = yield call(putChangeUserInfo, payload);
    const user = snakeToCamel(response?.data.data);
    yield put(userActions.set({ ...user, messageEmailSuccess: 'E-mail alterado com sucesso.' }));
  } catch (error) {
    yield put(userActions.error(error));
  }
}

function* changeProfileImage(action) {
  try {
    const { payload } = action;
    yield call(patchChangeProfileImage, payload);
    yield put(userActions.changeProfileImageSuccess());
  } catch (error) {
    yield put(userActions.error(error));
  }
}

function* logout(action) {
  try {
    // const { history } = action.payload;
    yield all([put(userActions.logout()), put(cartActions.resetCart())]);
    window.location.href = ROUTE_HOME
    window.dataLayer.push({
      'event': 'userLoggedOut',
      'user': {}
    });
    saveState({}, 'user');
    saveState(initialState, 'cart');
    saveState('', 'accessToken');
    window.location.reload();
  } catch (error) {
    yield put(userActions.error(error));
  }
}

function* changeProfileData(action) {
  try {
    const { payload } = action;
    const { cpf: documentNumber, phone } = payload;
    const phoneNumber = phone.replace(/[^0-9]+/g, '');
    const ddd = phoneNumber.substr(0, 2);
    const number = phoneNumber.substr(2);
    const response = yield call(putChangeUserInfo, jsonFormatPersonalInfo({ documentNumber, ddd, phoneNumber: number }));
    const user = snakeToCamel(response?.data.data);
    yield put(userActions.set({ ...user, messageDataSuccess: 'Dados alterados com sucesso.' }));
    saveState(user, 'user');
  } catch (error) {
    yield put(userActions.error(error));
  }
}

function* changeSpeed(action) {
  try {
    const { payload } = action;
    const response = yield call(patchPreferences, jsonFormatPreferences({ videoSpeed: payload }));
    const preferences = snakeToCamel(response?.data);
    yield put(userActions.set({ preferences }));
    const user = yield call(loadState, 'user');
    // const user = loadState('user');
    user.preferences = preferences;
    saveState(user, 'user');
  } catch (error) {
    yield put(userActions.error(error));
    console.log('error', error);
  }
}

function* changeResolution(action) {
  try {
    const { payload } = action;
    const response = yield call(patchPreferences, jsonFormatPreferences({ resolutionVideo: payload }));
    const preferences = snakeToCamel(response?.data);
    yield put(userActions.set({ preferences }));
    const user = yield call(loadState, 'user');
    console.log('user', user)
    user.preferences = preferences;
    saveState(user, 'user');
  } catch (error) {
    yield put(userActions.error(error));
    console.log('error', error);
  }
}

function* setUserGender(action) {
  try {
    const { payload } = action;
    const response = yield call(setGender, payload);
    const user = snakeToCamel(response?.data.data);
    yield put(userActions.set(user));
    saveState(user, 'user');
  } catch (error) {
    yield put(userActions.error(error));
    console.log('error', error);
  }
}

function* setUserDateOfBirth(action) {
  try {
    const { payload } = action;
    const response = yield call(setDateOfBirth, payload);
    const user = snakeToCamel(response?.data.data);
    yield put(userActions.set(user));
    saveState(user, 'user');
  } catch (error) {
    yield put(userActions.error(error));
    console.log('error', error);
  }
}

export default function* watchUser() {
  yield takeEvery(types.REGISTER_REQUEST, register);
  yield takeEvery(types.LOGIN_REQUEST, login);
  yield takeEvery(types.LOGIN_SOCIAL_REQUEST, loginSocialNetwork);
  yield takeEvery(types.LOGIN_PARTNERS, loginPartners);
  yield takeEvery(types.FORGOT_PASSWORD_REQUEST, forgotPassword);
  yield takeEvery(types.TOKEN_VALIDITY_REQUEST, checkValidityToken);
  yield takeEvery(types.RESET_PASSWORD_REQUEST, resetPassword);
  yield takeEvery(types.CHANGE_PASSWORD_REQUEST, changePassword);
  yield takeEvery(types.CHANGE_EMAIL_REQUEST, changeEmail);
  yield takeEvery(types.CHANGE_PROFILE_IMAGE_REQUEST, changeProfileImage);
  yield takeEvery(types.CHANGE_PROFILE_DATA, changeProfileData);
  yield takeEvery(types.LOGOUT_REQUEST, logout);
  yield takeEvery(types.CHANGE_SPEED_REQUEST, changeSpeed);
  yield takeEvery(types.CHANGE_RESOLUTION_REQUEST, changeResolution);
  yield takeEvery(types.SET_USER_GENDER, setUserGender);
  yield takeEvery(types.SET_USER_DATE_OF_BIRTH, setUserDateOfBirth);
}
