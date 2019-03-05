import React, { useState, useEffect, useReducer } from 'react';
import { Avatar, Col, List, Row } from 'antd';

import { users as userService } from '../network/feathersSocket';
import './userList.css';

function reducerUsers(users, action) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...users.filter(usr => usr._id !== action.payload._id), action.payload];
    case 'remove':
      return users.filter(usr => usr._id !== action.payload._id);
    default:
      return users;
  }
}

function UserList({ currentUserId, displayNames, roomId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, usersDispatch] = useReducer(reducerUsers, []);

  useEffect(
    () => {
      if (roomId) {
        setIsLoading(true);
        userService.byRoom({ roomId })
          .then(users => {
            setIsLoading(false);
            usersDispatch({ type: 'set', payload: users.data });
          });
      } else {
        usersDispatch({ type: 'set', payload: [] });
      }
    },
    [roomId]
  );

  useEffect(
    () => {
      const offUpdate = userService.on.update(user => {
        usersDispatch({ type: 'add', payload: user });
      });
      const offRemove = userService.on.remove(user => {
        usersDispatch({ type: 'remove', payload: user });
      });
      const offLeave = userService.on.leaveRoom(({ user }) => {
        usersDispatch({ type: 'remove', payload: user });
      });
      const offJoin = userService.on.joinRoom(({ user }) => {
        usersDispatch({ type: 'add', payload: user });
      });

      return () => {
        offUpdate();
        offRemove();
        offLeave();
        offJoin();
      };
    },
    []
  );

  const renderDisplayName = (item) => (displayNames) ?
    item.displayName : '';

  return (users.length) ? (
    <List
      className='userList'
      dataSource={users.sort((a, b) => a.displayName > b.displayName)}
      itemLayout="horizontal"
      loading={isLoading}
      renderItem={item => (
        <List.Item>
          <Row
            className={(item._id === currentUserId) ? 'currentUser' : ''}
            type="flex"
            align="middle"
            justify="space-between"
            style={{width: '100%'}}
          >
            <Col>
              <Avatar size={'small'} shape="square">
                {item.displayName.split(' ').reduce((a, b) => `${a}${b.charAt(0)}`, '')}
              </Avatar>
              {renderDisplayName(item)}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  ): null;
}

export default UserList;
