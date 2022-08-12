import { call, put, takeEvery } from 'redux-saga/effects';
import { types, actions as contactActions } from '../../reducers/contact';
import { postContact } from '../../api/contact';
import { callToastSuccess } from '../../utils/callToast';

function* sendForm(action) {
  try {
    const formContact = action.payload;
    yield call(postContact, formContact);
    // const responseData = snakeToCamel(response?.data?.data);
    //yield put(contactActions.set({ ...responseData, responseContact: 'Formulário enviado com sucesso. Dentro de algumas horas nossa equipe entrará em contato!' }));
    callToastSuccess('Formulário enviado com sucesso. Dentro de algumas horas nossa equipe entrará em contato!');
    window.dataLayer.push({
      'event': 'contactFormSubmitted'
    });
  } catch (error) {
    yield put(contactActions.error(error));
  }
}

export default function* watchContact() {
  yield takeEvery(types.REQUEST, sendForm);
}
