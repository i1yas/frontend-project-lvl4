import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container, Row, Col, Navbar, Button, Stack,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import Channels from './Channels';
import Chat from './Chat';
import useAuth from '../hooks';
import { fetchData } from '../slices/common';

const Header = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  const handleLogOut = () => {
    localStorage.removeItem('userId');
    auth.logOut();
  };

  return (
    <Navbar>
      <Container>
        <Navbar.Brand>{t('app.title')}</Navbar.Brand>
        <Stack direction="horizontal" gap={1}>
          <div className="p-2">{auth.username}</div>
          <Button
            size="sm"
            onClick={handleLogOut}
          >
            {t('auth.logout')}
          </Button>
        </Stack>
      </Container>
    </Navbar>
  );
};

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  React.useEffect(() => {
    dispatch(fetchData())
      .catch(() => {
        toast(t('errors.fetchData'));
      });
  }, [dispatch, t]);

  return (
    <>
      <Header />
      <Container fluid="md" className="shadow rounded overflow-hidden my-4 h-100">
        <Row className="h-100">
          <Col md={2} className="px-0 h-100 bg-light border-end">
            <Channels />
          </Col>
          <Col md className="px-0 h-100">
            <Chat />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainPage;
