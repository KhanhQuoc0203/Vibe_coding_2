import React from 'react';
import { Layout, Menu } from 'antd';
import { BookOutlined, UserOutlined, DashboardOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: 'books', icon: <BookOutlined />, label: <Link to="/books">Quản lý Sách</Link> },
    { key: 'readers', icon: <UserOutlined />, label: <Link to="/readers">Độc giả</Link> },
    { key: 'report', icon: <FileTextOutlined />, label: <Link to="/report">Độc giả chưa trả</Link> },
  ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
      <div className="demo-logo" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '2rem' }}>
        LMS - KHDL19B
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['dashboard']} items={items} style={{ flex: 1, minWidth: 0 }} />
    </Header>
  );
};

export default AppHeader;