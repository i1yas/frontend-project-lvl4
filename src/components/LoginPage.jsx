import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

const formInitialState = {
  login: '',
  password: '',
};

const validationSchema = Yup.object({
  login: Yup.string().min(3),
  password: Yup.string().min(8),
});

const LoginPage = () => (
  <Formik initialValues={formInitialState} validationSchema={validationSchema}>
    <Form>
      <Field type="text" name="login" placeholder="Login" />
      <ErrorMessage name="login" />
      <Field type="password" name="password" placeholder="Password" />
      <ErrorMessage name="password" />
      <button type="submit">Submit</button>
    </Form>
  </Formik>
);

export default LoginPage;
