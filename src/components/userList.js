import React, { useState, useEffect } from 'react';
import { Avatar, Col, List, Row } from 'antd';

import { users as userService } from '../network/feathersSocket';
import './userList.css';

function UserList({ currentUserId, displayNames, roomId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(
    () => {
      if (roomId) {
        setIsLoading(true);
        userService.byRoom({ roomId })
          .then(users => {
            setIsLoading(false);
            setUsers(users.data);
          });
      } else {
        setUsers([]);
      }
    },
    [roomId]
  );

  // TODO listen for new users added/removed

  const renderDisplayName = (item) => (displayNames) ?
    item.displayName : '';

  return (
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
  );
}

export default UserList;
