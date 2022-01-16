import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
  useLocation,
} from 'react-router-dom';
import io from 'socket.io-client';

import LoginPage from './LoginPage';
import MainPage from './MainPage';
import NotFoundPage from './NotFoundPage';
import authContext, { websocketContext } from '../contexts';
import useAuth from '../hooks';
import store from '../slices';

const WebsocketProvider = ({ children }) => {
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    setSocket(io('/'));
  }, []);

  return (
    <websocketContext.Provider
      value={{ socket }}
    >
      {children}
    </websocketContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const { username } = JSON.parse(localStorage.getItem('userId'));

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
  }, []);

  if (auth.loggedIn) {
    const from = location.state?.from || { pathname: '/' };
    const to = from.pathname;
    return <Navigate to={to} state={{ from }} />;
  }

  return children;
};

const wrapWithProviders = (element) => (
  <AuthProvider>
    <WebsocketProvider>
      <ReduxProvider store={store}>
        {element}
      </ReduxProvider>
    </WebsocketProvider>
  </AuthProvider>
);

const App = () => wrapWithProviders(
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>,
);

export default App;
