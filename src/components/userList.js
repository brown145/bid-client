import React, { useState, useEffect } from 'react';
import { Avatar, Col, List, Row } from 'antd';

import { users as userService } from '../network/feathersSocket';
import './userList.css';

function UserList(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(
    () => {
      if (props.authenticated) {
        setIsLoading(true);
        userService.all()
          .then(users => {
            setIsLoading(false);
            setUsers(users.data);
          });
      } else {
        setUsers([]);
      }
    },
    [props.authenticated]
  );

  const renderDisplayName = (item) => (props.displayNames) ?
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
            className={(item._id === props.currentUser._id) ? 'currentUser' : ''}
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
