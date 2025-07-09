import React from 'react';

import {
  Layout,
  Space,
  Typography,
  Col,
  Divider,
  Row,
  theme,
  Form,
  Input,
  Button,
  Checkbox,
} from 'antd';

import { LockFilled, UserOutlined } from '@ant-design/icons';
import Auth from '@src/layouts/auth';
import { useNavigate } from 'react-router-dom';

const { useToken } = theme;

function SignIn(props: any) {
  const { token } = useToken();
  const navigate = useNavigate();
  const { history } = props;
  const handleSubmit = () => {
    return navigate('/manager/home');
    // window.location.href = "/manager/home"
    // history.push("/manager/home")
  };
  return (
    <>
      <Auth />
    </>
  );
}

export default SignIn;
