// App.js
import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './GeneralComponents/SideBar';
import ContentArea from './GeneralComponents/ContentArea';
import FooterBar from './GeneralComponents/FooterBar';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} userRole={1} />

        <Layout>
          <ContentArea />
          
          <FooterBar />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
