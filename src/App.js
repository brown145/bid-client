import React, { Component } from 'react';
import { message, notification, Layout } from 'antd';

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

// TODO: determine if we have a channel and if so show inviet info and only if authenticated
notification.open({
    message: 'Room Name',
    description: 'Do you want to invite people to room; just use the url silly!'
  });

// TODO: collapsed state if mobile
// TODO: prevent collablesed state if no data or change no data text
class App extends Component {
  state = {
    authenticated: false,
    collapseSide: false,
    user: {}
  };

  doAuth = (attemptRedirect) => {
    const hideLoginMessage = message.loading('Authenticating', 0);
    login()
      .then(({ user }) => {
        message.success(`Authenticated as ${user.displayName}`);
        this.setState({ authenticated: true, user });
      })
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

  render() {
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
              authenticated={this.state.authenticated}
              currentUser={this.state.user}
              displayNames={!this.state.collapseSide}
            />
          </Sider>
          <Content>
            <IssueList authenticated={this.state.authenticated} />
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
