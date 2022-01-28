import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
  useLocation,
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import MainPage from './MainPage';
import NotFoundPage from './NotFoundPage';
import authContext, { websocketContext } from '../contexts';
import useAuth from '../hooks';
import store from '../slices';

const packageInfo = require('../../package.json');

const rollbarConfig = {
  accessToken: 'a424f7d0810545acaff4f5655c0bcdd3',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
    version: packageInfo.version,
  },
};

const WebsocketProvider = ({ children, socket }) => (
  <websocketContext.Provider
    value={{ socket }}
  >
    {children}
  </websocketContext.Provider>
);

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const { username } = JSON.parse(localStorage.getItem('userId')) || {};

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn, logIn, logOut, username,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />;
};

const LoginRoute = ({ children }) => {
  const auth = useAuth();
  const userId = JSON.parse(localStorage.getItem('userId'));
  const location = useLocation();

  React.useEffect(() => {
    if (userId) {
      auth.logIn();
    }
  }, [auth, userId]);

  if (auth.loggedIn) {
    const from = location.state?.from || { pathname: '/' };
    const to = from.pathname;
    return <Navigate to={to} state={{ from }} />;
  }

  return children;
};

const withProviders = (WrappedComponent) => {
  const WithProviders = ({ socket, i18n }) => (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <WebsocketProvider socket={socket}>
            <ReduxProvider store={store}>
              <I18nextProvider i18n={i18n}>
                <WrappedComponent />
                <ToastContainer />
              </I18nextProvider>
            </ReduxProvider>
          </WebsocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
  WithProviders.displayName = 'WithProviders';
  return WithProviders;
};

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        exact
        element={(
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
          )}
      />
      <Route
        path="/login"
        exact
        element={(
          <LoginRoute>
            <LoginPage />
          </LoginRoute>
        )}
      />
      <Route
        path="/signup"
        exact
        element={(
          <LoginRoute>
            <SignupPage />
          </LoginRoute>
        )}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default withProviders(App);
