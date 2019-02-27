import React, { Component } from 'react';
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
// TODO: prevent collablesed state if no data or change no data text
// TODO: make functional Component; useState and useEffect
class App extends Component {
  state = {
    authenticated: false,
    collapseSide: false,
    user: {},
    room: {}
  };

  doAuth = (attemptRedirect) => {
    const hideLoginMessage = message.loading('Authenticating', 0);
    login()
      .then(({ user }) => {
        message.success(`Authenticated as ${user.displayName}`);
        this.setState({ authenticated: true, user });
      })
      .then(this.handleRoomAssignment)
      .catch(() => {
        this.setState({ authenticated: false, user: null })
        if (attemptRedirect) {
          window.location.href = `${bidServer.uri}/auth/google`;
        }
      })
      .finally(hideLoginMessage);
  }

  componentDidMount() {
    this.doAuth(false);
  }

  handleAuthenticate = () => {
    this.doAuth(true);
  }

  handleDeauthenticate = () => {
    logout()
      .then(() => {
        message.success('Logged out');
        this.setState({ authenticated: false, user: {} });
      });
  }

  // TODO: revisit logic here
  handleRoomAssignment = () => {
    let roomName = window.location.pathname.slice(1);

    const onSuccess = (room) => {
      userService.joinRoom({ user: this.state.user, roomId: room._id })
        .then(() => this.setState({ room }))
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
  }

  render() {
    const roomId = (this.state.room) ? this.state.room._id : null;
    return (
      <Layout className="app">
        <Header>
          <Head
            authenticated={this.state.authenticated}
            onAuthenticate={this.handleAuthenticate}
            onDeauthenticate={this.handleDeauthenticate}
          />
        </Header>
        <Layout>
          <Sider
            theme={'light'}
            collapsible
            collapsed={this.state.collapseSide}
            onCollapse={() => this.setState({ collapseSide: !this.state.collapseSide })}
            width={160}
            collapsedWidth={40}
          >
            <UserList
              currentUserId={(this.state.user) ? this.state.user._id : null}
              displayNames={!this.state.collapseSide} // TODO: rename this prop
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
}

export default App;
