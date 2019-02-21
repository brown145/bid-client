import React from 'react';
import { Button, Col, List, Popconfirm, Row } from 'antd';

function PendingItem(props) {
  const handleRemove = (event) => {
    props.onRemove(props.item._id);
  }

  const handleStart = (event) => {
    props.onStart(props.item._id);
  }

  return (
    <List.Item className="pendingIssue">
      <Row type="flex" align="middle" justify="space-between" style={{width: '100%'}}>
        <Col>
          <span className="issueName">{props.item.name}</span>
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
