import React from 'react';
import { Col, Row } from 'antd';
import { ReactComponent as Logo } from '../svg/logo.svg';
import './head.css';

import Login from '../components/login';

function Head({ authenticated, onAuthenticate, onDeauthenticate }) {
  return (
    <Row className='head' type="flex" align="middle" justify="space-between">
      <Col>
        <Row className='head' type="flex" align="middle" justify="start">
          <Col>
            <Logo className="logo" />
          </Col>
          <Col>
            <h1>Planning Poker</h1>
          </Col>
        </Row>
      </Col>
      <Col>
        <Login
          authenticated={authenticated}
          onAuthenticate={onAuthenticate}
          onDeauthenticate={onDeauthenticate}
        />
      </Col>
    </Row>
  );
}

export default Head;
