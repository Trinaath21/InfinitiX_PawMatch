// ContentArea.js
import React from 'react';
import { Layout, theme } from 'antd';
import { Routes, Route } from 'react-router-dom';
//lostFound
import PersonalListing from '../LostFoundReport/PersonalListing';
import ViewMoreDetails from '../LostFoundReport/ViewMoreDetails'; // Import the ViewMoreDetails component
import PublicLostPetListings from '../LostFoundReport/PublicLostPetListings';
import ViewReplyReport from '../LostFoundReport/ViewReplyReport';
//adoption
import AddAdoption from "../Adoption/AddAdoption.js";
import EditAdoption from "../Adoption/EditAdoption.js";
import ViewPersonalListing from "../Adoption/ViewPersonalListing.js";
import ApplyAdoption from "../Adoption/ApplyAdoption.js";
import ViewMoreAdoption from "../Adoption/ViewMoreAdoption.js";
import ViewPublicListing from "../Adoption/ViewPublicListing.js";
//donation
import EditDonation from '../Donation/EditDonation';
import AddDonation from '../Donation/AddDonation';
import ViewAllDonation from '../Donation/ViewAllDonation';
import ViewMyDonation from '../Donation/ViewMyDonation';
//stray
import PersonalStrayListings from '../Stray/PersonalStrayListings';
//
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
        //lostFound
        <Route path="/" element={<PublicLostPetListings />} /> 
        <Route path="/publicLostReportList" element={<PublicLostPetListings />} /> 
        <Route path="/personalReportlisting" element={<PersonalListing />} /> 
        <Route path="/viewMoreDetails" element={<ViewMoreDetails />} /> 
        <Route path="/viewMoreDetails/:id" element={<ViewMoreDetails />} />
        <Route path="/viewReplyReport" element={<ViewReplyReport />} />

        //Adoption
        <Route path="/" element={<ViewPublicListing />} />
        <Route path="/addAdoption" element={<AddAdoption />} />
        <Route path="/editAdoption" element={<EditAdoption />} />
        <Route path="/editAdoption/:id" element={<EditAdoption />} />
        <Route path="/viewPersonalListing" element={<ViewPersonalListing />} />
        <Route path="/applyAdoption" element={<ApplyAdoption />} />
        <Route path="/ViewMoreAdoption" element={<ViewMoreAdoption />} />
        <Route path="/ViewPublicListing" element={<ViewPublicListing />} />

        //Donation
        <Route path="/" element={<ViewMyDonation/>} /> 
        <Route path="/edit-donation/:shelterId" element={<EditDonation />} />
        <Route path="/" element={<AddDonation/>} /> 
        <Route path="/" element={<ViewAllDonation/>} />

        //Stray
        <Route path="/" element={<PersonalStrayListings/>} />
      </Routes>
    </Content>
  );
};

export default ContentArea;
