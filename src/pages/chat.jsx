import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';
import ChatWidget from '../components/ChatWidget';

const Chat = () => (
  <Layout>
    <Helmet title={'Chat'} />
    <Header></Header>
    <Container>
      <br />
      <br />
      <br />
      <ChatWidget />
    </Container>
  </Layout>
);

export default Chat;
