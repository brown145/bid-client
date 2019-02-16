import React from 'react';
import { Col, Row } from 'antd';
import './foot.css';

function Foot() {
  return (
    <Row className='foot' type="flex" align="middle" justify="center">
      <Col>
        Made by: <strong>Scott Brown</strong>
      </Col>
    </Row>
  );
}

export default Foot;
