import React from 'react';
import {
  Container, Row, Col, Form, Stack, Button,
  Navbar,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import routes from '../routes';

const formInitialState = {
  username: '',
  password: '',
  passwordConfirm: '',
};

const validationSchema = Yup.object({
  username: Yup.string().min(3, 'usernameLength').max(20, 'usernameLength'),
  password: Yup.string().min(6, 'passwordLength'),
  passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'passwordConfirm'),
});

const SignupPage = () => {
  const [authError, setAuthError] = React.useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (values) => {
    try {
      const { data } = await axios.post(routes.signup(), values);
      localStorage.setItem('userId', JSON.stringify(data));
      setAuthError(null);
      navigate({ pathname: '/' });
    } catch (e) {
      if (!axios.isAxiosError(e)) throw e;
      const { status } = e.response;
      if (status === 409) setAuthError('errors.usernameCollision');
      setAuthError('errors.signup');
    }
  };

  const formik = useFormik({ initialValues: formInitialState, validationSchema, onSubmit });

  const renderErrorMessage = (name) => {
    const error = formik.errors[name];
    const hasError = formik.touched[name] && formik.errors[name];
    if (!hasError) return null;
    const message = t(`formErrors.${error.key || error}`);
    return <Form.Text>{message}</Form.Text>;
  };

  const form = (
    <Form onSubmit={formik.handleSubmit}>
      {[
        {
          type: 'text',
          name: 'username',
          label: t('auth.username'),
        },
        {
          type: 'password',
          name: 'password',
          label: t('auth.password'),
        },
        {
          type: 'password',
          name: 'passwordConfirm',
          label: t('auth.passwordConfirm'),
        },
      ].map(({ name, type, label }) => (
        <Form.Group key={name} className="mb-2">
          <Form.Control
            type={type}
            name={name}
            placeholder={label}
            aria-label={label}
            onChange={formik.handleChange}
            value={formik.values[name]}
          />
          {renderErrorMessage(name)}
        </Form.Group>
      ))}
      {authError && (
        <div className="mb-2">
          <Form.Text>{t(authError)}</Form.Text>
        </div>
      )}
      <Stack direction="horizontal" gap={3}>
        <Button type="submit">{t('auth.register')}</Button>
        <div><a href="/login">{t('auth.login')}</a></div>
      </Stack>
    </Form>
  );

  return (
    <Container className="my-4">
      <Row>
        <Col className="mb-4">
          <Navbar.Brand>{t('app.title')}</Navbar.Brand>
        </Col>
      </Row>
      <Row>
        <Col md={3}>{form}</Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
