import React from 'react';
import { Layout, theme } from 'antd';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// LostFound
import PersonalListing from '../LostFoundReport/PersonalListing';
import ViewMoreDetails from '../LostFoundReport/ViewMoreDetails'; 
import PublicLostPetListings from '../LostFoundReport/PublicLostPetListings';
import ViewReplyReport from '../LostFoundReport/ViewReplyReport';
// Adoption
import AddAdoption from "../Adoption/AddAdoption.js";
import EditAdoption from "../Adoption/EditAdoption.js";
import ViewPersonalListing from "../Adoption/ViewPersonalListing.js";
import ApplyAdoption from "../Adoption/ApplyAdoption.js";
import ViewMoreAdoption from "../Adoption/ViewMoreAdoption.js";
import ViewPublicListing from "../Adoption/ViewPublicListing.js";
// Donation
import EditDonation from '../Donation/EditDonation';
import AddDonation from '../Donation/AddDonation';
import ViewAllDonation from '../Donation/ViewAllDonation';
import ViewMyDonation from '../Donation/ViewMyDonation';
// Stray
import PublicStrayListings from '../Stray/PublicStrayListings';
import PersonalStrayListings from '../Stray/PersonalStrayListings';
import ViewMoreStrayDetails from '../Stray/ViewMoreStrayDetails';
// Forum
import PostDetails from '../Forum/PostDetails.js';
import ContentComponent from '../Forum/ForumPostComponent.js';
import Login from '../Pages/Login/index.js';
import Register from '../Pages/Register/index.js';
import ForgotPassword from '../Pages/Password/forgetpassword.js';
import ResetPassword from '../Pages/Password/resetpassword.js';
import Main from '../Pages/main.js';
import Home from '../Pages/Home/index.js';
import MemberProfile from '../Pages/Profiles/MemberProfile.js';
import EditMemberProfile from '../Pages/Profiles/EditMemberProfile.js';
import ShelterProfile from '../Pages/Profiles/ShelterProfile.js';
import EditShelterProfile from '../Pages/Profiles/EditShelterProfile.js';
import Sidebar from './SideBar.js';
import FooterBar from './FooterBar.js';
import LandingPage from '../Pages/LandingPage/index.js';

const { Content } = Layout;

const ContentArea = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Get the current location
  const location = useLocation();

  // Define the routes where Sidebar and FooterBar should NOT be shown
  const noSidebarFooterRoutes = ['/login', '/register', '/forget-password', '/reset-password','/landing'];

  // Check if the current route is in the noSidebarFooterRoutes array
  const showSidebarAndFooter = !noSidebarFooterRoutes.includes(location.pathname);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {showSidebarAndFooter && (
        <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} userRole={1} />
      )}

      <Layout>
        <Content
          // style={{
          //   margin: '24px 16px',
          //   padding: 24,
          //   minHeight: 280,
          //   background: colorBgContainer,
          //   borderRadius: borderRadiusLG,
          // }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<LandingPage/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/main" element={<Main />} />
            <Route path="home" element={<Home />} />
            <Route path="profiles/member" element={<MemberProfile />} />
            <Route path="profiles/member/edit" element={<EditMemberProfile />} />
            <Route path="profiles/shelter" element={<ShelterProfile />} />
            <Route path="profiles/shelter/edit" element={<EditShelterProfile />} />

            {/* LostFound Routes */}
            <Route path="/" element={<PublicLostPetListings />} />
            <Route path="/publicLostReportList" element={<PublicLostPetListings />} />
            <Route path="/personalReportlisting" element={<PersonalListing />} />
            <Route path="/viewMoreDetails" element={<ViewMoreDetails />} />
            <Route path="/viewMoreDetails/:id" element={<ViewMoreDetails />} />
            <Route path="/viewReplyReport" element={<ViewReplyReport />} />

            {/* Adoption Routes */}
            <Route path="/" element={<ViewPublicListing />} />
            <Route path="/addAdoption" element={<AddAdoption />} />
            <Route path="/editAdoption" element={<EditAdoption />} />
            <Route path="/editAdoption/:id" element={<EditAdoption />} />
            <Route path="/viewPersonalListing" element={<ViewPersonalListing />} />
            <Route path="/applyAdoption" element={<ApplyAdoption />} />
            <Route path="/ViewMoreAdoption" element={<ViewMoreAdoption />} />
            <Route path="/ViewPublicListing" element={<ViewPublicListing />} />

            {/* Donation Routes */}
            <Route path="/ViewMyDonation" element={<ViewMyDonation />} />
            <Route path="/edit-donation/:shelterId" element={<EditDonation />} />
            <Route path="/AddDonation" element={<AddDonation />} />
            <Route path="/ViewAllDonation" element={<ViewAllDonation />} />

            {/* Stray Routes */}
            <Route path="/PublicStrayListings" element={<PublicStrayListings />} />
            <Route path="/ViewMoreStrayDetails" element={<ViewMoreStrayDetails />} />
            <Route path="/PersonalStrayListings" element={<PersonalStrayListings />} />

            {/* Forum Routes */}
            <Route path="/forum" element={<ContentComponent />} />
            <Route path="/post/:post_id" element={<PostDetails />} />
          </Routes>
        </Content>

        {showSidebarAndFooter && <FooterBar />}
      </Layout>
    </Layout>
  );
};

export default ContentArea;
