import React from 'react';
import { Button } from 'react-bootstrap';
import useAuth from '../hooks';

const MainPage = () => {
  const auth = useAuth();

  const handleLogOut = () => {
    localStorage.removeItem('userId');
    auth.logOut();
  };

  return (
    <div>
      main page
      <Button onClick={handleLogOut}>Log out</Button>
    </div>
  );
};

export default MainPage;
