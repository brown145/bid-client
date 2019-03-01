import React, { useState, useEffect } from 'react';
import { message, notification, Layout } from 'antd';
import randomWords from 'random-words';

import { rooms as roomService, users as userService } from './network/feathersSocket';

import { login, logout } from './network/feathersSocket';
import Head from './components/head';
import UserList from './components/userList';
import IssueList from './components/issueList';
import Foot from './components/foot';
import bidServer from './utility/bidServer';
import './App.css';

const { Header, Sider, Footer, Content } = Layout;

message.config({
  top: 70
});

notification.config({
  placement: 'bottomRight',
  bottom: 50
});

// TODO: collapsed state if mobile
function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isSideClosed, setSideClosed] = useState(false);
  const [user, setUser] = useState({});
  const [room, setRoom] = useState({});

  useEffect(() => {
    doAuth(false);
  }, []);

  const doAuth = (attemptRedirect) => {
    const hideLoginMessage = message.loading('Authenticating', 0);
    login()
      .then(({ user }) => {
        message.success(`Authenticated as ${user.displayName}`);
        setAuthenticated(true);
        setUser(user);
      })
      .then(handleRoomAssignment)
      .catch(() => {
        setAuthenticated(false);
        setUser(null);
        if (attemptRedirect) {
          window.location.href = `${bidServer.uri}/auth/google`;
        }
      })
      .finally(hideLoginMessage);
  }

  const handleAuthenticate = () => {
    doAuth(true);
  };

  const handleDeauthenticate = () => {
    logout()
      .then(() => {
        message.success('Logged out');
        setAuthenticated(false);
        setUser({});
      });
  };

  // TODO: revisit logic here
  const handleRoomAssignment = () => {
    let roomName = window.location.pathname.slice(1);

    const onSuccess = (room) => {
      userService.joinRoom({ user, roomId: room._id })
        .then(() => setRoom(room))
        .catch((...rest) => console.warn('TODO: catch', rest));

      // TODO: messageing
      notification.open({
          message: room.name,
          description: `Do you want to invite people to room; just use the url silly! ${window.location.href}`
        });
    }

    if (roomName) {
      roomService.byName({ name: roomName })
        .then(({ data }) => onSuccess(data[0]))
        .catch((...rest) => console.warn('TODO: catch', rest));
    } else {
      roomName = randomWords({min:2, max:5, join:'-'});
      window.history.pushState({}, 'Planning Poker', roomName);
      roomService.create({ name: roomName })
        .then(onSuccess);
    }
  };

  const roomId = (room) ? room._id : null;

  return (
    <Layout className="app">
      <Header>
        <Head
          authenticated={isAuthenticated}
          onAuthenticate={handleAuthenticate}
          onDeauthenticate={handleDeauthenticate}
        />
      </Header>
      <Layout>
        <Sider
          theme={'light'}
          collapsible
          collapsed={isSideClosed}
          onCollapse={() => setSideClosed((isClosed) => !isClosed)}
          width={160}
          collapsedWidth={40}
        >
          <UserList
            currentUserId={(user) ? user._id : null}
            displayNames={!isSideClosed}
            roomId={roomId}
          />
        </Sider>
        <Content>
          <IssueList roomId={roomId} />
        </Content>
      </Layout>
      <Footer>
        <Foot />
      </Footer>
    </Layout>
  );
}

export default App;
