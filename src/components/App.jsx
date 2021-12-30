import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const MainPage = () => 'main';
const LoginPage = () => 'login';
const NotFoundPage = () => 'not found';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" exact element={<MainPage />} />
      <Route path="/login" exact element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default App;
