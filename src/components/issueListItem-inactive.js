import React, { useReducer, useEffect } from 'react';
import { Col, List, Row, Statistic, Tag, Tooltip } from 'antd';
import { flow, groupBy, last, map, meanBy, reverse, sortBy } from 'lodash';
import { bids as bidService } from '../network/feathersSocket';

function reducerBids(bids, action) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...bids, action.payload]
    default:
      return bids;
  }
}

function InactiveItem({ item }) {
  const [bids, bidsDispatch] = useReducer(reducerBids, []);

  useEffect(() => {
    bidService.byIssue({ issueId: item._id })
      .then(bids => bidsDispatch({ type: 'set', payload: bids.data }));
    // TODO: would need to be a channel -> do we really need?
    //  is only if we get a late bid that did not
    // bidService.on.create(issue => bidsDispatch({ type: 'add', payload: issue }));
  }, []);

  const bidMean = meanBy(bids, 'value');
  const bidMedian = flow(
    (data) => map(data, (bid) => bid.value),
    (data) => sortBy(data),
    (data) => (data.length % 2 === 0) ?
      (data[(data.length /2) -1] + data[data.length/ 2]) / 2 :
      data[(data.length - 1) / 2]
  )(bids);
  const bidMode = flow(
    (data) => groupBy(data, 'value'),
    (data) => map(data, (value, key) => ({ bidValue: key, count: value.length })),
    (data) => sortBy(data, 'count'),
    (data) => map(data, 'bidValue'),
    (data) => last(data)
  )(bids);

  const renderBidSums = () => {
    if (!bids) {
      return '';
    }

    const bidsByBidValue = flow(
      (data) => groupBy(data, 'value'),
      (data) => map(data, (value, key) => ({ bidValue: key, bids: value })),
      (data) => reverse(data)
    )(bids);

    return bidsByBidValue.map(({ bidValue, bids = [] }) => (
      <Tooltip key={bidValue} title={bids.map(bid => (<div key={bid._id}>{bid.createdBy.displayName}</div>))}>
        <Tag className={(bidValue === bidMode) ? 'modeTag' : ''}>
          <strong>{bidValue}</strong>&nbsp;
          <em>x{bids.length}</em>
        </Tag>
      </Tooltip>
    ));
  }

  return (
    <List.Item className='InactiveIssue'>
      <Row type="flex" align="middle" justify="space-between" style={{width: '100%'}}>
        <Col>
          <span className='issueName'>{item.name}</span>
          {renderBidSums()}
        </Col>
        <Col>
          <Row type="flex" align="middle" justify="space-between">
            <Col><Statistic title="Mean" value={bidMean} /></Col>
            <Col><Statistic title="Median" value={bidMedian} /></Col>
            <Col><Statistic title="Mode" value={bidMode} /></Col>
            <Col><Statistic title="Total" value={bids.length} /></Col>
          </Row>
        </Col>
      </Row>
    </List.Item>
  );
}

export default InactiveItem;
