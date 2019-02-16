import React from 'react';
import { Button } from 'antd';

function Login(props) {
  return (
    <Button
      type="primary"
      ghost={props.authenticated}
      onClick={props.onAuthenticate}
    >
      {(props.authenticated) ? 'Logout' : 'Login' }
    </Button>
  );
}

export default Login;
