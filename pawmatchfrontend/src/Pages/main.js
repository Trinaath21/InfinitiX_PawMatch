import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import SideBar from "../GeneralComponents/SideBar";
import FooterBar from "../GeneralComponents/FooterBar";
import logo from "../images/PawMatchLogo.png";

const { Header, Content } = Layout;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout className="main-container">
      <SideBar collapsed={collapsed} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              position: "absolute",
              left: "16px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <img
              src={logo}
              alt="Paw Match Logo"
              style={{ height: "60px", width: "auto" }}
            />
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <Outlet />
        </Content>

        <FooterBar />
      </Layout>
    </Layout>
  );
};

export default Main;
