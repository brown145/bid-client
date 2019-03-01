import React, { useState, useEffect, useReducer } from 'react';
import { Avatar, Col, List, Row } from 'antd';

import { users as userService } from '../network/feathersSocket';
import './userList.css';

function reducerUsers(users, action) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...users, action.payload];
    case 'remove':
      return users.filter(i => i._id !== action.payload);
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

  useEffect(() => {
    const offJoin = userService.on.join(user => {
      usersDispatch({ type: 'add', payload: user });
    });

    const offLeave = userService.on.leave(user => {
      usersDispatch({ type: 'remove', payload: user });
    });

    return () => {
      offJoin();
      offLeave();
    };
  }, []);

  const renderDisplayName = (item) => (displayNames) ?
    item.displayName : '';

  return (users.length) ? (
    <List
      className='userList'
      dataSource={users}
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
