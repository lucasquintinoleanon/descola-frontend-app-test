import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InputMask from 'react-input-mask';
import isEmail from 'validator/lib/isEmail';
import * as _ from 'lodash';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import yupToObject from 'yup-to-object';
import { actions as coursesActions } from '../../reducers/courses';
import { actions as addressActions } from '../../reducers/address';
import { actions as userActions } from '../../reducers/user';
import { BASE_URL_CDN } from '../../constants';

import Footer from '../../descola-frontend-components/Footer';
import states from '../../data/states';
import validateCPF from '../../utils/validateCPF';
import Head from '../../descola-frontend-components/Head';
import { callToastError, callToastSuccess } from '../../utils/callToast';

const ImgIcon = `${BASE_URL_CDN}app/assets/images/camera.svg`;

const getFieldName = field => {
  switch (field) {
    case 'cpf': {
      return 'CPF';
    }
    case 'phone': {
      return 'Telefone';
    }
    case 'zipcode': {
      return 'CEP';
    }
    case 'street': {
      return 'Logradouro';
    }
    case 'number': {
      return 'Número';
    }
    case 'complement': {
      return 'Complemento';
    }
    case 'neighborhood': {
      return 'Bairro';
    }
    case 'city': {
      return 'Cidade';
    }
    case 'state': {
      return 'Estado';
    }
    case 'country': {
      return 'País';
    }
    case 'email': {
      return 'E-mail';
    }
    case 'emailConfirmation': {
      return 'Confirme seu E-mail';
    }
    case 'password': {
      return 'Senha';
    }
    case 'passwordConfirmation': {
      return 'Confirme a nova senha';
    }
    default: {
      return '';
    }
  }
};

const ProfileSchema = yup.object().shape({
  cpf: yup
    .string()
    .nullable()
    .required('Campo Obrigatório')
    .test('validar-cpf', 'CPF Inválido', validateCPF),
  phone: yup
    .string()
    .required('Campo Obrigatório')
    .matches(/\([0-9]{2}\) [0-9]{5}-[0-9]{4}/, { message: 'Número Inválido' })
});

const AddressSchema = yup.object().shape({
  zipcode: yup
    .string()
    .required('Campo Obrigatório')
    .matches(/[0-9]{5}-[0-9]{3}/, { message: 'CEP Inválido' }),
  street: yup.string().required('Campo Obrigatório'),
  number: yup.string().required('Campo Obrigatório'),
  complement: yup.string().required('Campo Obrigatório'),
  neighborhood: yup.string().required('Campo Obrigatório'),
  city: yup.string().required('Campo Obrigatório'),
  state: yup.string().required('Campo Obrigatório'),
  country: yup.string().required('Campo Obrigatório')
});

const InvalidFeedback = ({ error }) => (error ? <span className="feedback-invalid">{error}</span> : <span />);

InvalidFeedback.propTypes = {
  error: PropTypes.string
};
InvalidFeedback.defaultProps = {
  error: ''
};

const MyProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);
  const purchasedCourses = useSelector(state => state.courses.purchased);
  const address = useSelector(state => state.address);
  const [formProfile, setFormProfile] = useState({
    phone: '',
    cpf: '',
    zipcode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    email: '',
    emailConfirmation: '',
    password: '',
    passwordConfirmation: ''
  });
  const [errorPassword, setErrorPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorProfileImage, setErrorProfileImage] = useState('');
  const [errorPersonalData, setErrorPersonalData] = useState({});
  const [addressErrors, setAddressError] = useState({});

  useEffect(() => {
    const onLoadPage = () => {
      const { id } = currentUser;
      dispatch(coursesActions.getPurchasedRequest({ id }));
    };
    onLoadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const currentAddress = _.last(currentUser?.address);

  useEffect(() => {
    const onChangeSuccess = () => {
      if (currentUser?.messageDataSuccess) {
        callToastSuccess(currentUser?.messageDataSuccess);
      }
    };
    onChangeSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.messageDataSuccess]);

  useEffect(() => {
    const onChangeSuccess = () => {
      if (currentUser?.messageAddressSuccess) {
        callToastSuccess(currentUser?.messageAddressSuccess);
      }
    };
    onChangeSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.messageAddressSuccess]);

  useEffect(() => {
    const onChangeSuccess = () => {
      if (currentUser?.messageEmailSuccess) {
        callToastSuccess(currentUser?.messageEmailSuccess);
      }
    };
    onChangeSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.messageEmailSuccess]);

  useEffect(() => {
    const onChangeSuccess = () => {
      if (currentUser?.messagePasswordSuccess) {
        callToastSuccess(currentUser?.messagePasswordSuccess);
      }
    };
    onChangeSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.messagePasswordSuccess]);

  useEffect(() => {
    const onLoadZip = () => {
      if (address.cep) {
        const { logradouro, bairro, localidade, uf } = address;

        setFormProfile({
          ...formProfile,
          street: logradouro,
          neighborhood: bairro,
          city: localidade,
          state: uf,
          country: 'Brasil'
        });
      }
    };
    onLoadZip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    const loadedAddress = _.last(currentUser?.address);

    const formattedPhone =
      currentUser?.ddd && currentUser?.phoneNumber
        ? `(${currentUser?.ddd}) ${currentUser?.phoneNumber.substr(0, 5)}-${currentUser?.phoneNumber.substr(5, 4)}`
        : '';
    setFormProfile({
      ...formProfile,
      ...loadedAddress,
      street: loadedAddress?.street ?? '',
      complement: loadedAddress?.complement ?? '',
      neighborhood: loadedAddress?.neighborhood ?? '',
      city: loadedAddress?.city ?? '',
      state: loadedAddress?.state ?? '',
      country: 'Brasil',
      phone: formattedPhone,
      cpf: currentUser.documentNumber || ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.address, currentUser?.phoneNumber, currentUser?.ddd]);

  const handleInputChange = (name, value) => {
    setFormProfile({ ...formProfile, [name]: value });
  };

  const handleOnBlur = () => {
    dispatch(addressActions.getRequest(`${formProfile.zipcode.slice(0, 5)}${formProfile.zipcode.slice(6, 9)}`));
  };

  const handleValidate = () => {
    AddressSchema.validate(formProfile, { abortEarly: false })
      .then(() => {
        setAddressError({});
      })
      .catch(yupError => {
        const errorObject = yupToObject(yupError);
        setAddressError(errorObject);
      });
  };

  const onHandleChangeEmail = e => {
    e.preventDefault();
    setErrorEmail('');
    if (!formProfile.email) {
      setErrorEmail('Favor preencher os campos de e-mail.');
      callToastError('Favor preencher os campos de e-mail.');
      return;
    }
    if (formProfile.email !== formProfile.emailConfirmation) {
      setErrorEmail('Os e-mails não são iguais.');
      callToastError('Os e-mails não são iguais.');
      return;
    }
    if (!isEmail(formProfile.email)) {
      setErrorEmail('E-mail inválido');
      callToastError('E-mail inválido');
      return;
    }
    dispatch(userActions.changeEmailRequest({ email: formProfile.email }));
  };

  const onHandleChangePassword = e => {
    e.preventDefault();
    setErrorPassword('');
    const { password, passwordConfirmation } = formProfile;
    if (!password) {
      setErrorPassword('Favor preencher os campos de senha.');
      callToastError('Favor preencher os campos de senha.');
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorPassword('As senhas não são iguais.');
      callToastError('As senhas não são iguais.');
      return;
    }
    if (password.length < 6) {
      setErrorPassword('Senha tem que conter no mínimo 6 caracteres.');
      callToastError('Senha tem que conter no mínimo 6 caracteres.');
      return;
    }
    dispatch(userActions.changePasswordRequest({ password, passwordConfirmation }));
  };

  const onHandleInputFile = evt => {
    setErrorProfileImage('');
    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    if (file.size > 2000000) {
      setErrorProfileImage('Imagem com tamanho maior que 2mb.');
      return;
    }

    reader.onloadend = () => {
      dispatch(userActions.changeProfileImageRequest({ picture: reader.result?.split(',')[1] }));
    };
  };

  const onHandleChangeAddress = e => {
    e.preventDefault();
    AddressSchema.validate(formProfile, { abortEarly: false })
      .then(() => {
        const { zipcode, street, number, complement, neighborhood, city, state, country } = formProfile;
        const id = _.last(currentUser?.address)?.id;

        const name = id ? _.last(currentUser?.address)?.name : 'Endereço Principal';
        dispatch(
          addressActions.changeAddressRequest({
            id,
            name,
            recipientName: `${currentUser.firstName} ${currentUser.lastName}`,
            zipcode,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            country
          })
        );
      })
      .catch(yupError => {
        const errorObject = yupToObject(yupError);
        callToastError(
          Object.keys(errorObject)
            .map(key => `${getFieldName(key)} é ${errorObject[key]}`)
            .join('\r\n')
        );
        setAddressError(errorObject);
      });
  };

  const onHandleChangeData = e => {
    e.preventDefault();

    ProfileSchema.validate(formProfile, { abortEarly: false })
      .then(() => {
        setErrorPersonalData({});
        dispatch(userActions.changeProfileDataRequest({ cpf: formProfile.cpf, phone: formProfile.phone }));
      })
      .catch(yupError => {
        const errorObject = yupToObject(yupError);
        callToastError(
          Object.keys(errorObject)
            .map(key => `${getFieldName(key)} é ${errorObject[key]}`)
            .join('\r\n')
        );
        setErrorPersonalData(errorObject);
      });
  };

  return (
    <>
      <Head title="Meu Perfil" />
      <div className="main index">
        <section className="mb-60">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>
                  Meu <span className="primary">Perfil</span>
                </h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-4">
                <div className="box-primary">
                  <h2 className="hero-title primary">{purchasedCourses.allIds.length}</h2>
                  <h3>Cursos adquiridos</h3>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="box-primary">
                  <h2 className="hero-title primary">
                    {purchasedCourses.allIds.reduce(
                      (prev, curr) => prev + Number(purchasedCourses.byId[curr].progress === 100),
                      0
                    )}
                  </h2>
                  <h3>Cursos concluídos</h3>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="box-primary">
                  <h2 className="hero-title primary">{purchasedCourses.credits || 0}</h2>
                  <h3>Créditos a utilizar</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="border-l primary">Editar Cadastro</h1>
              </div>
              <div className="col-md-4 col-lg-3">
                <div className="profile__user-info">
                  <div className="profile__user-info__img">
                    {!currentUser.fetchingImageProfile && <img src={currentUser.picture} alt="user" />}
                    <div className="btn profile__user-info__img__btn">
                      <img src={ImgIcon} alt="Imagem perfil" />
                      Tamanho maximo 2MB
                      <input type="file" accept="image/*" onChange={onHandleInputFile} />
                    </div>
                  </div>
                  <span className="feedback-invalid">{errorProfileImage}</span>
                  <div className="profile__user-info__dada">
                    <h2>
                      {currentUser.firstName} {currentUser.lastName}
                    </h2>
                    {currentAddress && (
                      <p>
                        {currentAddress.street}, nº {currentAddress.number}
                        <br />
                        {currentAddress.neighborhood} - {currentAddress.zipcode}
                        <br />
                        {currentAddress.city} - {currentAddress.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-lg-9">
                <form className="input-box profile__form">
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="nome">Nome</label>
                      <input
                        type="text"
                        id="nome"
                        value={currentUser.firstName}
                        disabled
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Tooltip on bottom"
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="sobrenome">Sobrenome</label>
                      <input className="input-box" type="text" id="sobrenome" value={currentUser.lastName} disabled />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="cpf">CPF</label>
                      <InputMask
                        mask="999.999.999-99"
                        type="text"
                        id="cpf"
                        value={formProfile.cpf}
                        onChange={e => handleInputChange('cpf', e.currentTarget.value)}
                      />
                      <InvalidFeedback error={errorPersonalData?.cpf} />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="telefone">Telefone</label>
                      <InputMask
                        mask="(99) 99999-9999"
                        type="text"
                        id="telefone"
                        value={formProfile.phone}
                        onChange={e => handleInputChange('phone', e.currentTarget.value)}
                      />
                      <InvalidFeedback error={errorPersonalData?.phone} />
                    </div>
                    <div className="col-12 box-btn-submit" />
                    <div className="col-12 box-btn-submit">
                      <button className="btn btn-dark" onClick={onHandleChangeData}>
                        Alterar Dados
                      </button>
                    </div>
                    <div className="col-12 feedback-valid">{currentUser.messageDataSuccess}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="CEP">CEP</label>
                      <InputMask
                        mask="99999-999"
                        type="text"
                        id="CEP"
                        value={formProfile.zipcode}
                        onChange={e => handleInputChange('zipcode', e.currentTarget.value)}
                        onBlur={() => {
                          handleOnBlur();
                          handleValidate();
                        }}
                      />
                      <InvalidFeedback error={addressErrors?.zipcode} />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="logradouro">Logradouro</label>
                      <input
                        type="text"
                        id="logradouro"
                        value={formProfile.street}
                        onChange={e => handleInputChange('street', e.currentTarget.value)}
                        onBlur={() => handleValidate()}
                      />
                      <InvalidFeedback error={addressErrors?.street} />
                    </div>
                    <div className="col-sm-3">
                      <label htmlFor="numero">Número</label>
                      <input
                        type="number"
                        id="numero"
                        value={formProfile.number}
                        onChange={e => handleInputChange('number', e.currentTarget.value)}
                        onBlur={() => handleValidate()}
                      />
                      <InvalidFeedback error={addressErrors?.number} />
                    </div>
                    <div className="col-sm-9">
                      <label htmlFor="complemento">Complemento</label>
                      <input
                        type="text"
                        id="complemento"
                        value={formProfile.complement}
                        onChange={e => handleInputChange('complement', e.currentTarget.value)}
                        onBlur={() => handleValidate()}
                      />
                      <InvalidFeedback error={addressErrors?.complement} />
                    </div>
                    <div className="col-sm-3">
                      <label htmlFor="bairro">Bairro</label>
                      <input
                        type="text"
                        id="bairro"
                        value={formProfile.neighborhood}
                        onChange={e => handleInputChange('neighborhood', e.currentTarget.value)}
                        onBlur={() => handleValidate()}
                      />
                      <InvalidFeedback error={addressErrors?.neighborhood} />
                    </div>
                    <div className="col-sm-3">
                      <label htmlFor="cidade">Cidade</label>
                      <input
                        type="text"
                        id="cidade"
                        value={formProfile.city}
                        onChange={e => handleInputChange('city', e.currentTarget.value)}
                        onBlur={() => handleValidate()}
                      />
                      <InvalidFeedback error={addressErrors?.city} />
                    </div>
                    <div className="col-4 col-sm-2">
                      <label htmlFor="estado">Estado</label>
                      <select
                        id="estado"
                        value={formProfile.state || 'nonSelectable'}
                        onChange={e => handleInputChange('state', e.currentTarget.value)}
                        onBlur={() => handleValidate()}
                      >
                        <option value="nonSelectable" disabled />
                        {states.map(({ uf }) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                      <InvalidFeedback error={addressErrors?.state} />
                    </div>
                    <div className="col-8 col-sm-4">
                      <label htmlFor="pais">País</label>
                      <input
                        type="text"
                        id="pais"
                        value={formProfile.country}
                        onChange={e => handleInputChange('country', e.currentTarget.value)}
                        onBlur={() => handleValidate()}
                      />
                      <InvalidFeedback error={addressErrors?.country} />
                    </div>
                    <div className="col-12 box-btn-submit">
                      <button className="btn btn-dark" disabled={address?.isFetching} onClick={onHandleChangeAddress}>
                        Alterar Endereço
                      </button>
                    </div>
                    <div className="col-12 feedback-valid">{currentUser.messageAddressSuccess}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="email">E-mail</label>
                      <input
                        type="text"
                        id="email"
                        value={formProfile.email}
                        onChange={e => handleInputChange('email', e.currentTarget.value)}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="emailConfirmation">Confirme seu E-mail</label>
                      <input
                        type="text"
                        id="emailConfirmation"
                        value={formProfile.emailConfirmation}
                        onChange={e => handleInputChange('emailConfirmation', e.currentTarget.value)}
                      />
                    </div>
                    <div className="col-12 feedback-invalid">{errorEmail}</div>
                    <div className="col-12 feedback-valid">{currentUser.messageEmailSuccess}</div>
                    <div className="col-12 box-btn-submit">
                      <button className="btn btn-dark" onClick={e => onHandleChangeEmail(e)}>
                        Alterar e-mail
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="password">Alterar senha</label>
                      <input
                        type="password"
                        id="password"
                        value={formProfile.password}
                        onChange={e => handleInputChange('password', e.currentTarget.value)}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="passwordConfirmation">Confirme a nova senha</label>
                      <input
                        type="password"
                        id="passwordConfirmation"
                        value={formProfile.passwordConfirmation}
                        onChange={e => handleInputChange('passwordConfirmation', e.currentTarget.value)}
                      />
                    </div>
                    <div className="col-12 feedback-invalid">{errorPassword}</div>
                    <div className="col-12 feedback-valid">{currentUser.messagePasswordSuccess}</div>
                    <div className="col-12 box-btn-submit">
                      <button className="btn btn-dark" onClick={e => onHandleChangePassword(e)}>
                        Alterar senha
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer type='private' />
    </>
  );
};

export default MyProfile;
