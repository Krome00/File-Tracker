// src/layout/DefaultLayout.jsx
import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";
import logo from '../assets/logo.png';

const { Header, Content, Sider } = Layout;

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const location = useLocation();

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (e) => {
    e.preventDefault();
    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  const selectedKey = location.pathname;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" style={{ color: "white", padding: ".5rem", textAlign: 'center' }}>
          <img src={logo} height={100} className="mt-3 mb-1" />
        </div>
        <div><p className="text-center h4" style={{ color: "white", padding: "0rem", fontWeight: "bold"}} > EQUIPMENT HISTORY </p></div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={["/dashboard"]}
        >
          <Menu.Item key="/dashboard">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/equipments">  
            <Link to="/equipments">Equipments Table</Link>
          </Menu.Item>
          <Menu.Item key="/users">
            <Link to="/users">Users</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div><p className="text-center h4" style={{ color: "black", padding: "0rem", fontWeight: "bold"}} > EQUIPMENT HISTORY </p></div>
          <a onClick={onLogout} href="#" style={{ color: "#1677ff" }}>
            Logout
          </a>
        </Header>

        <Content style={{ margin: "1rem", padding: "1rem", background: "#fff" }}>
          <Outlet />
        </Content>

        {notification && (
          <div
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "#52c41a",
              padding: "10px 20px",
              borderRadius: "5px",
              color: "white",
            }}
          >
            {notification}
          </div>
        )}
      </Layout>
    </Layout>
  );
}
