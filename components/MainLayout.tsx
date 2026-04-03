'use client';

import React, { useState } from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  CalendarOutlined,
  PhoneOutlined,
  CheckSquareOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  BankOutlined,
  GlobalOutlined,
  ContainerOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Typography, Space, Tooltip, Dropdown } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { themeConfig } from '@/lib/theme';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme: currentTheme, toggleTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const colors = currentTheme === 'dark' ? themeConfig.dark : themeConfig.light;
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <MenuFoldOutlined />,
      onClick: handleLogout,
    },
  ];

  const saasAdminMenuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'SaaS Dashboard',
    },
    {
      key: '/admin/organizations',
      icon: <GlobalOutlined />,
      label: 'Organizations',
    },
    {
      key: '/admin/branches',
      icon: <BankOutlined />,
      label: 'Branches',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
  ];

  const crmMenuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      type: 'group',
      label: 'CRM',
      children: [
        { key: '/leads', icon: <AppstoreOutlined />, label: 'Leads' },
        { key: '/customers', icon: <ShopOutlined />, label: 'Customers' },
        { key: '/contacts', icon: <TeamOutlined />, label: 'Contacts' },
      ],
    },
    {
      type: 'group',
      label: 'Sales',
      children: [
        { key: '/deals', icon: <SolutionOutlined />, label: 'Deals' },
        { key: '/quotes', icon: <FileTextOutlined />, label: 'Quotes' },
        { key: '/sales-orders', icon: <ShoppingCartOutlined />, label: 'Sales Orders' },
        { key: '/invoices', icon: <DollarOutlined />, label: 'Invoices' },
      ],
    },
    {
      type: 'group',
      label: 'Procurement',
      children: [
        { key: '/vendors', icon: <BankOutlined />, label: 'Vendors' },
        { key: '/purchase-orders', icon: <ContainerOutlined />, label: 'Purchase Orders' },
        { key: '/products', icon: <AppstoreOutlined />, label: 'Products' },
      ],
    },
    {
      type: 'group',
      label: 'Interaction',
      children: [
        { key: '/meetings', icon: <CalendarOutlined />, label: 'Meetings' },
        { key: '/calls', icon: <PhoneOutlined />, label: 'Calls' },
        { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Tasks' },
      ],
    },
    {
      type: 'group',
      label: 'Support',
      children: [
        { key: '/tickets', icon: <CustomerServiceOutlined />, label: 'Tickets' },
      ],
    },
    {
      type: 'group',
      label: 'System',
      children: [
        { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
      ],
    },
  ];

  const menuItems = user?.role === 'SUPER_ADMIN' ? saasAdminMenuItems : crmMenuItems;

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={260} 
        theme={currentTheme}
        style={{ 
          borderRight: `1px solid ${colors.borderColor}`,
          height: '100vh',
          position: 'relative',
          background: colors.layoutBg // Pure Black
        }}
      >
        {/* Fixed Sidebar Header */}
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderBottom: `1px solid ${colors.borderColor}`,
          background: colors.layoutBg
        }}>
          <Title level={4} style={{ margin: 0, color: colors.primary }}>
            {user?.role === 'SUPER_ADMIN' ? 'SaaS Management' : (collapsed ? 'CRM' : 'Multi-Tenant CRM')}
          </Title>
        </div>
        
        {/* Scrollable Menu Area */}
        <div style={{ 
          height: 'calc(100vh - 64px)', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          paddingBottom: 24,
          background: colors.layoutBg
        }}>
          <Menu
            mode="inline"
            theme={currentTheme}
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            items={menuItems as any}
            onClick={({ key }) => router.push(key)}
            style={{ 
              borderRight: 0,
              background: 'transparent', // Inherit Pure Black from container
            }}
          />
        </div>
      </Sider>

      <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Fixed Top Header */}
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          borderBottom: `1px solid ${colors.borderColor}`,
          flexShrink: 0
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ paddingRight: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Space size="large">
              <Tooltip title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}>
                <Button 
                  type="text" 
                  icon={currentTheme === 'light' ? <BulbOutlined /> : <BulbFilled style={{ color: '#fadb14' }} />} 
                  onClick={toggleTheme}
                  style={{ fontSize: '18px' }}
                />
              </Tooltip>
              <Space>
                <span style={{ fontWeight: 500 }}>
                  {user?.role === 'SUPER_ADMIN' ? 'SaaS Management' : (user?.organizationId || 'Organization')}
                </span>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <Button type="primary" shape="circle" icon={<UserOutlined />} />
                </Dropdown>
              </Space>
            </Space>
          </div>
        </Header>

        {/* Scrollable Content Area */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer, // Neutral Grey
            borderRadius: borderRadiusLG,
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
