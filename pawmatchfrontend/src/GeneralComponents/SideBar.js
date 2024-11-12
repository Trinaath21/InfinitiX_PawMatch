import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import pawMatchLogo from '../images/PawMatchLogo.png';
import {
  DesktopOutlined,
  HomeOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  PieChartOutlined,
  YuqueFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

function getItem(label, key, icon, onClick, children) {
  return {
    key,
    icon,
    onClick, // Add onClick function
    children,
    label,
  };
}

const Sidebar = ({ collapsed, toggleCollapse, userRole }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const items = [
    getItem('Home', '1', <HomeOutlined />, () => navigate('/')),
    userRole !== 2 && getItem('Lost & Found', 'sub1', <PieChartOutlined />, null, [
      getItem('Public Listing', '2-1', null, () => navigate('/publicLostReportList')),
      getItem('Personal Listing', '2-2', null, () => navigate('/personalReportlisting')),
    ]),
    getItem('Adoption', 'sub2', <HeartOutlined />, null, [
      getItem('Public Listing', '3-1', null, () => navigate('/adoption/public')),
      getItem('Personal Listing', '3-2', null, () => navigate('/adoption/personal'))
    ]),
    getItem('Stray', 'sub3', <YuqueFilled />, null, [
      getItem('Public Listing', '4-1', null, () => navigate('/stray/public')),
      getItem('Personal Listing', '4-2', null, () => navigate('/stray/personal'))
    ]),
    getItem('Donation', '5', <DesktopOutlined />, () => navigate('/donation')),
    getItem('Settings', '6', <SettingOutlined />, () => navigate('/settings')),
    getItem('Logout', '7', <LogoutOutlined />, () => navigate('/logout')),
    {
      key: 'collapse-button',
      label: (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
          style={{
            fontSize: '16px',
            width: '100%',
            height: 64,
            margin: 0,
          }}
        />
      ),
      children: null,
    },
  ].filter(Boolean);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapse}
      breakpoint="md" 
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: collapsed ? '10px' : '20px',
          transition: 'padding 0.3s',
        }}
      >
        <img
          src={pawMatchLogo}
          alt="PawMatch Logo"
          style={{
            width: collapsed ? '40px' : '100px',
            height: 'auto',
            transition: 'width 0.3s',
          }}
        />
      </div>

      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
    </Sider>
  );
};

export default Sidebar;
