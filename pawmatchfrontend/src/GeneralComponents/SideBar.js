import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import pawMatchLogo from '../images/PawMatchLogo.png';
import {
  HomeOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  AlertOutlined,
  YuqueFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MoneyCollectOutlined,
  DesktopOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

function getItem(label, key, icon, onClick, children) {
  return {
    key,
    icon,
    onClick,
    children,
    label,
  };
}

const Sidebar = ({ collapsed, toggleCollapse }) => {
  const navigate = useNavigate();

  // Get role from localStorage
  const userRole = localStorage.getItem('role'); // Retrieve role as a string

  // Define menu items dynamically based on role
  const guestItems = [
    getItem('Home', '1', <HomeOutlined />, () => navigate('home')),
    getItem('Lost & Found', 'sub2', <AlertOutlined />, null, [
      getItem('Public Listing', '2-1', null, () => navigate('/publicLostReportList')),
    ]),
    getItem('Adoption', 'sub3', <HeartOutlined />, null, [
      getItem('Public Listing', '3-1', null, () => navigate('/ViewPublicListing')),
    ]),
    getItem('Stray', 'sub4', <YuqueFilled />, null, [
      getItem('Public Listing', '4-1', null, () => navigate('/PublicStrayListings')),
    ]),
    getItem('Forum', '5', <UserOutlined />, () => navigate('/forum')),
    getItem('Donation', '6', <MoneyCollectOutlined />, () => navigate('/ViewAllDonation')),
    getItem('Login', '7', <LoginOutlined />, () => {
      localStorage.clear(); // Clears all local storage
      navigate('/login'); // Navigates to /landing
  }),
  
  ];

  const memberItems = [
    getItem('Home', '1', <HomeOutlined />, () => navigate('home')),
    getItem('Lost & Found', 'sub2', <AlertOutlined />, null, [
      getItem('Public Listing', '2-1', null, () => navigate('/publicLostReportList')),
      getItem('Personal Listing', '2-2', null, () => navigate('/personalReportlisting')),
    ]),
    getItem('Adoption', 'sub3', <HeartOutlined />, null, [
      getItem('Public Listing', '3-1', null, () => navigate('/ViewPublicListing')),
      getItem('Personal Listing', '3-2', null, () => navigate('/viewPersonalListing')),
    ]),
    getItem('Stray', 'sub4', <YuqueFilled />, null, [
      getItem('Public Listing', '4-1', null, () => navigate('/PublicStrayListings')),
      getItem('Personal Listing', '4-2', null, () => navigate('/PersonalStrayListings')),
    ]),
    getItem('Forum', '5', <DesktopOutlined />, () => navigate('/forum')),
    getItem('Donation', '6', <MoneyCollectOutlined />, () => navigate('/ViewAllDonation')),
    getItem('Profile', '7', <UserOutlined />, () => navigate('profiles/member')),
    getItem('Logout', '8', <LogoutOutlined />, () => {
      localStorage.clear(); // Clears all local storage
      navigate('/landing'); // Navigates to /landing
  }),
  
  ];

  const shelterItems = [
    getItem('Home', '1', <HomeOutlined />, () => navigate('home')),
    getItem('Adoption', 'sub2', <HeartOutlined />, null, [
      getItem('Personal Listing', '2-1', null, () => navigate('/viewPersonalListing')),
    ]),
    getItem('Stray', 'sub3', <YuqueFilled />, null, [
      getItem('Public Listing', '3-1', null, () => navigate('/PublicStrayListings')),
    ]),
    getItem('Forum', '4', <UserOutlined />, () => navigate('/forum')),
    getItem('Donation', '5', <MoneyCollectOutlined />, () => navigate('/ViewMyDonation')),
    getItem('Profile', '6', <UserOutlined />, () => navigate('profiles/shelter')),
    getItem('Logout', '7', <LogoutOutlined />, () => {
      localStorage.clear(); // Clears all local storage
      navigate('/landing'); // Navigates to /landing
  }),
  
  ];

  // Select items based on role
  const items =
    userRole === 'guest' ? guestItems :
    userRole === 'member' ? memberItems :
    userRole === 'shelter' ? shelterItems : [];

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