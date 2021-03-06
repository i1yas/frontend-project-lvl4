import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Form, Button, Container, Row, Col, Stack,
  Navbar,
} from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import routes from '../routes';

const formInitialState = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string(),
  password: Yup.string(),
});

const LoginPage = () => {
  const [authError, setAuthError] = React.useState(null);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    try {
      const { data } = await axios.post(routes.login(), values);
      localStorage.setItem('userId', JSON.stringify(data));
      setAuthError(null);

      const prevLocation = location.state?.from || { pathname: '/' };
      navigate(prevLocation.pathname);
    } catch (e) {
      setAuthError('errors.wrongLoginPass');
    }
  };

  const formik = useFormik({ initialValues: formInitialState, validationSchema, onSubmit });

  const renderErrorMessage = (name) => {
    const error = formik.errors[name];
    const hasError = formik.touched[name] && error;
    if (!hasError) return null;
    const message = t(`formErrors.${error.key || error}`, {
      count: error.values,
    });

    return (
      <Form.Text>{message}</Form.Text>
    );
  };

  const form = (
    <Form onSubmit={formik.handleSubmit}>
      <Stack gap={2}>
        <Form.Group>
          <Form.Control
            type="text"
            name="username"
            placeholder={t('auth.yourNick')}
            aria-label={t('auth.yourNick')}
            required
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {renderErrorMessage('username')}
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            name="password"
            placeholder={t('auth.password')}
            aria-label={t('auth.password')}
            required
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {renderErrorMessage('password')}
          {authError && <Form.Text>{t(authError)}</Form.Text>}
        </Form.Group>
        <Stack direction="horizontal" gap={3}>
          <Button type="submit">{t('auth.login')}</Button>
          <div><Link to="/signup">{t('auth.registerPage')}</Link></div>
        </Stack>
      </Stack>
    </Form>
  );

  return (
    <Container className="my-4">
      <Row>
        <Col className="mb-4">
          <Navbar.Brand as={Link} to="/">{t('app.title')}</Navbar.Brand>
        </Col>
      </Row>
      <Row>
        <Col md="auto">{form}</Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
