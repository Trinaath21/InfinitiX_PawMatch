import React from 'react';
import { Layout, Menu, Button } from 'antd';
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

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Define the Sidebar Component
const Sidebar = ({ collapsed, toggleCollapse, userRole }) => {
  // Define dropdown items with conditional check for userRole
  const items = [
    getItem('Home', '1', <HomeOutlined />),
    userRole !== 2 && getItem('Lost & Found', 'sub1', <PieChartOutlined />, [
      getItem('Public Listing', '2-1'),
      getItem('Personal Listing', '2-2')
    ]),
    getItem('Adoption', 'sub2', <HeartOutlined />, [
      getItem('Public Listing', '3-1'),
      getItem('Personal Listing', '3-2')
    ]),
    getItem('Stray', 'sub3', <YuqueFilled />, [
      getItem('Public Listing', '4-1'),
      getItem('Personal Listing', '4-2')
    ]),
    getItem('Donation', '5', <DesktopOutlined />),
    getItem('Settings', '6', <SettingOutlined />),
    getItem('Logout', '7', <LogoutOutlined />),
    {
      key: 'collapse-button',
      label: (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
          style={{
            fontSize: '16px',
            width: '100%', // Make the button full width
            height: 64, // Set height for the button
            margin: 0, // Remove any default margin
          }}
        />
      ),
      // Disable dropdown for the button item
      children: null,
    },
  ].filter(Boolean); // Filter out undefined items

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
            width: collapsed ? '40px' : '100px', // Adjust width based on collapsed state
            height: 'auto',
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Menu Items with Dropdowns */}
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
    </Sider>
  );
};

export default Sidebar;
