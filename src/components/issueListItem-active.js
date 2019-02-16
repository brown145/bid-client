import React, { useState } from 'react';
import { Button, Col, List, Row, Tag } from 'antd';
import { bids as bidService } from '../network/feathersSocket';

const ButtonGroup = Button.Group;

function ActiveItem(props) {
  const [bid, setBid] = useState(NaN);
  const handleClose = (event) => {
    props.onClose(props.item._id);
  }

  const handleBid = (event) => {
    const { _id } = props.item;
    const { value } = event.target;
    setBid(value);
    bidService.create({ issueId: _id, value })
  }

  const renderBidder = () => (
    <ButtonGroup onClick={handleBid}>
      <Button value={1}>1</Button>
      <Button value={2}>2</Button>
      <Button value={3}>3</Button>
      <Button value={5}>5</Button>
      <Button value={8}>8</Button>
      <Button value={13}>13</Button>
      <Button value={21}>21</Button>
    </ButtonGroup>
  )

  const renderBid = () => (
    <Tag>{bid}</Tag>
  )

  return (
    <List.Item>
      <Row type="flex" align="middle" justify="space-between" style={{width: '100%'}}>
        <Col>
          <span className='issueName'>{props.item.name}</span>
          {(bid) ? renderBid() : renderBidder()}
        </Col>
        <Col>
          <Button onClick={handleClose}>Close</Button>
        </Col>
      </Row>
    </List.Item>
  );
}

export default ActiveItem;
