import React from 'react';
import {
  Layout,
  Space,
  Typography,
  Col,
  Divider,
  Row,
  theme,
  Menu,
  Dropdown,
  Avatar,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  CalendarOutlined,
  IdcardOutlined,
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ExitToAppOutlined,
  PasswordOutlined,
  PeopleOutline,
} from '@mui/icons-material';

const { Header, Footer, Sider, Content } = Layout;

const { useToken } = theme;
const { Text, Link } = Typography;

function ManagerHome(props: any) {
  let navigate = useNavigate();
  const selectedKey = useLocation().pathname;

  const highlight = () => {
    if (selectedKey === '/manager/home') {
      return ['1'];
    } else if (selectedKey === '/manager/traffic') {
      return ['2'];
    }
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { children } = props;
  const [collapsed, setCollapsed] = React.useState(true);
  const { Header, Sider, Content } = Layout;

  const items: MenuProps['items'] = [
    {
      label: 'My Profile',
      key: '0',
      icon: <UserOutlined />,
    },
    {
      label: 'Change Password',
      key: '1',
      icon: <PasswordOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'Logout',
      key: '3',
      icon: <LogoutOutlined />,
    },
  ];
  return (
    <>
      <Layout style={{ background: '#ffffff' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          //  style={{
          //     overflow: 'auto',
          //     height: '100vh',
          //     position: 'fixed',
          //     left: 0,
          //     top: 0,
          //     bottom: 0,
          //   }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            },
          )}
          <div className='logo'>
            <Row align={'middle'} style={{ width: '100%' }}>
              <Col style={{ textAlign: 'center' }} span={24}>
                <Dropdown
                  menu={{ items }}
                  trigger={['click']}
                  placement='bottomLeft'
                >
                  <div onClick={(e) => e.preventDefault()}>
                    <Avatar
                      style={{ backgroundColor: '#FCA311' }}
                      size={collapsed ? 32 : 84}
                      icon={<UserOutlined />}
                    />
                  </div>
                </Dropdown>
              </Col>
            </Row>
          </div>
          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={['1']}
            selectedKeys={highlight()}
            items={[
              {
                key: '1',
                icon: <CalendarOutlined />,
                label: 'Calendar',
                onClick: () => {
                  navigate('/manager/home');
                },
              },
              {
                key: '2',
                icon: <PeopleOutline />,
                label: 'Traffic Management',
                onClick: () => {
                  navigate('/manager/traffic');
                },
              },
              {
                key: '3',
                icon: <ExitToAppOutlined />,
                label: 'Logout',
                onClick: () => {
                  navigate('/');
                },
              },
            ]}
          />
        </Sider>

        <Layout className='site-layout'>
          <Content style={{ margin: '24px 16px 0' }}>
            <div
              style={{
                padding: 5,
                textAlign: 'center',
                background: colorBgContainer,
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default ManagerHome;
