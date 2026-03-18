'use client';

import React from 'react';
import { Typography, Breadcrumb, Button, Space } from 'antd';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

interface ModuleHeaderProps {
  title: string;
  breadcrumbItems?: { title: string; href?: string }[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  backAction?: boolean;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  breadcrumbItems,
  primaryAction,
  backAction,
}) => {
  const router = useRouter();

  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumbItems && (
        <Breadcrumb style={{ marginBottom: 8 }}>
          {breadcrumbItems.map((item, index) => (
            <Breadcrumb.Item key={index}>
              {item.href ? <a onClick={() => router.push(item.href!)}>{item.title}</a> : item.title}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size="middle">
          {backAction && (
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              onClick={() => router.back()}
              style={{ fontSize: '18px' }}
            />
          )}
          <Title level={2} style={{ margin: 0 }}>
            {title}
          </Title>
        </Space>
        {primaryAction && (
          <Button
            type="primary"
            icon={primaryAction.icon || <PlusOutlined />}
            onClick={primaryAction.onClick}
            size="large"
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModuleHeader;
