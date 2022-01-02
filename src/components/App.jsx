import React from 'react';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
  useLocation,
} from 'react-router-dom';

import LoginPage from './LoginPage';
import MainPage from './MainPage';
import NotFoundPage from './NotFoundPage';
import authContext from '../contexts';
import useAuth from '../hooks';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
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

  if (userId) {
    const from = location.state?.from || { pathname: '/' };
    const to = from.pathname;
    auth.logIn();
    return <Navigate to={to} state={{ from }} />;
  }

  return children;
};

const App = () => (
  <AuthProvider>
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
    </Router>

  </AuthProvider>
);

export default App;
