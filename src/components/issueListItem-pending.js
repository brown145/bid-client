import React from 'react';
import { Button, Col, List, Popconfirm, Row } from 'antd';

function PendingItem({ item, onRemove, onStart }) {
  const handleRemove = (event) => {
    onRemove(item._id);
  }

  const handleStart = (event) => {
    onStart(item._id);
  }

  return (
    <List.Item className="pendingIssue">
      <Row type="flex" align="middle" justify="space-between" style={{width: '100%'}}>
        <Col>
          <span className="issueName">{item.name}</span>
          <Button type={'primary'} onClick={handleStart}>Start</Button>
        </Col>
        <Col>
          <Popconfirm title="Confrim Delete" onConfirm={handleRemove} okText="Delete" >
            <a href="#">Delete</a>
          </Popconfirm>
        </Col>
      </Row>
    </List.Item>
  );
}

export default PendingItem;
