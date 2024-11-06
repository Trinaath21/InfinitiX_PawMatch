// ContentArea.js
import React from 'react';
import { Layout, theme } from 'antd';
import { Routes, Route } from 'react-router-dom';
import PersonalListing from '../LostFoundReport/PersonalListing';
import ViewMoreDetails from '../LostFoundReport/ViewMoreDetails'; // Import the ViewMoreDetails component
const { Content } = Layout;

const ContentArea = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Routes>
        <Route path="/" element={<PersonalListing />} /> 
        <Route path="/personalReportlisting" element={<PersonalListing />} /> 
        <Route path="/viewMoreDetails" element={<ViewMoreDetails />} /> 
        {/* Add additional routes as needed */}
      </Routes>
    </Content>
  );
};

export default ContentArea;
