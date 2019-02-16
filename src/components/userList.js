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
      }
    },
    [props.authenticated]
  );

  return (
    <List
      className='userList'
      dataSource={users}
      itemLayout="horizontal"
      loading={isLoading}
      renderItem={item => (
        <List.Item>
          <Row type="flex" align="middle" justify="space-between" style={{width: '100%'}}>
            <Col>
              <Avatar size={'small'}>
                {item.displayName.split(' ').reduce((a, b) => `${a}${b.charAt(0)}`, '')}
              </Avatar>
              {item.displayName}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
}

export default UserList;