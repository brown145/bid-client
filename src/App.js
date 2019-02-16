import React, { Component } from 'react';
import { Layout } from 'antd';

import { login } from './network/feathersSocket';
import Head from './components/head';
import UserList from './components/userList';
import IssueList from './components/issueList';
import Foot from './components/foot';
import './App.css';

const { Header, Sider, Footer, Content } = Layout;

class App extends Component {
  state = {
    authenticated: false
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
        window.location.href = 'http://localhost:3030/auth/google';
      });
  }

  render() {
    return (
      <Layout className="app">
        <Header>
          <Head authenticated={this.state.authenticated} onAuthenticate={this.handleAuthenticate} />
        </Header>
        <Layout>
          <Sider theme={'light'}>
            <UserList
              authenticated={this.state.authenticated}
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
