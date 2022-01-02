import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../routes';

const formInitialState = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().min(3),
  password: Yup.string().min(3),
});

const LoginPage = () => {
  const [authError, setAuthError] = React.useState(null);

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
      setAuthError('auth error');
    }
  };

  const formik = useFormik({ initialValues: formInitialState, validationSchema, onSubmit });

  const renderErrorMessage = (name) => {
    const hasError = formik.touched[name] && formik.errors[name];
    return <Form.Text>{hasError && formik.errors[name]}</Form.Text>;
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group>
        <Form.Control
          type="text"
          name="username"
          placeholder="Login"
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
          placeholder="Password"
          required
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {renderErrorMessage('password')}
        {authError && <Form.Text>{authError}</Form.Text>}
      </Form.Group>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default LoginPage;
