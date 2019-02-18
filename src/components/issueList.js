import React, { Fragment, useState, useReducer, useEffect } from 'react';
import { Divider, List } from 'antd';
import './issueList.css';

import { issues as issueService } from '../network/feathersSocket';
import issueSorter from '../utility/issueSorter';
import ActiveItem from '../components/issueListItem-active';
import InactiveItem from '../components/issueListItem-inactive';
import PendingItem from '../components/issueListItem-pending';
import IssueAdder from '../components/issueAdder';

function reducerIssues(issues, action) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...issues, action.payload];
    case 'remove':
      return issues.filter(i => i._id !== action.payload);
    case 'update':
      const { _id, ...updateData } = action.payload;
      return [
        ...issues.filter(i => i._id !== _id),
        {
          ...issues.find(i => i._id === _id),
          ...updateData
        }
      ];
    default:
      return issues;
  }
}

function IssueList(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [issues, issuesDispatch] = useReducer(reducerIssues, []);

  useEffect(() => {
    if (props.authenticated) {
      setIsLoading(true);
      issueService.all()
        .then(issues => {
          setIsLoading(false);
          issuesDispatch({ type: 'set', payload: issues.data })
        });
    }
  }, [props.authenticated]);

  useEffect(() => {
    issueService.on.create(issue => issuesDispatch({ type: 'add', payload: issue }));
    issueService.on.update((issue) => issuesDispatch({ type: 'update', payload: issue }));
    issueService.on.remove((issue) => issuesDispatch({ type: 'remove', payload: issue._id }));
    return () => console.log('TODO - did we unmount?');
  }, []);

  const handleAddIssue = (issueData) =>
    issueService.create({ ...issueData })

  const handleRemoveIssue = (id) =>
    issueService.remove({ id })

  const handleStartIssue = (id) =>
    issueService.update({ id, status: 'active' })

  const handleCloseIssue = (id) =>
    issueService.update({ id, status: 'inactive' })

  const sortedArray = issues.sort(issueSorter);
  return (
    <Fragment>
      <List
        className='issueList'
        dataSource={sortedArray}
        itemLayout="horizontal"
        loading={isLoading}
        renderItem={(item) => {
          switch (item.status) {
            case 'active':
              return <ActiveItem item={item} onClose={handleCloseIssue} />;
            case 'inactive':
              return <InactiveItem item={item} />;
            default:
              return <PendingItem item={item} onRemove={handleRemoveIssue} onStart={handleStartIssue} />;
          }
        }}
      />
      <Divider className='listEnd' />
      <IssueAdder
        enabled={!isLoading && props.authenticated}
        onAdd={handleAddIssue}
      />
    </Fragment>
  );
}

export default IssueList;
