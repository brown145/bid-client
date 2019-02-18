import React, { Component } from 'react';
import { Layout } from 'antd';

import { login } from './network/feathersSocket';
import Head from './components/head';
import UserList from './components/userList';
import IssueList from './components/issueList';
import Foot from './components/foot';
import bidServer from './utility/bidServer';
import './App.css';

const { Header, Sider, Footer, Content } = Layout;

// TODO: collapsed state if mobile
// TODO: prevent collablesed state if no data or change no data text
class App extends Component {
  state = {
    authenticated: false,
    collapseSide: false
  };

  componentDidMount() {
    login()
      .then(() => this.setState({ authenticated: true }))
      .catch(() => this.setState({ authenticated: false }));
  }

  handleAuthenticate = () => {
    login()
      .then(() => this.setState({ authenticated: true }))
      .catch(() => {
        window.location.href = `${bidServer.uri}/auth/google`;
      });
  }

  render() {
    return (
      <Layout className="app">
        <Header>
          <Head authenticated={this.state.authenticated} onAuthenticate={this.handleAuthenticate} />
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
