// ContentArea.js
import React from 'react';
import { Layout, theme } from 'antd';
import { Routes, Route } from 'react-router-dom';
import PersonalListing from '../LostFoundReport/PersonalListing';
import ViewMoreDetails from '../LostFoundReport/ViewMoreDetails'; // Import the ViewMoreDetails component
import PublicLostPetListings from '../LostFoundReport/PublicLostPetListings';
import ViewReplyReport from '../LostFoundReport/ViewReplyReport';
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
        <Route path="/" element={<PublicLostPetListings />} /> 
        <Route path="/publicLostReportList" element={<PublicLostPetListings />} /> 
        <Route path="/personalReportlisting" element={<PersonalListing />} /> 
        <Route path="/viewMoreDetails" element={<ViewMoreDetails />} /> 
        <Route path="/viewMoreDetails/:id" element={<ViewMoreDetails />} />
        <Route path="/viewReplyReport" element={<ViewReplyReport />} />

      </Routes>
    </Content>
  );
};

export default ContentArea;
