'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockContacts } from '@/lib/mockData';

export default function ViewContactPage() {
  const params = useParams();
  const router = useRouter();
  const contact = mockContacts.find(c => c.id === params.id) || mockContacts[0];

  return (
    <div>
      <ModuleHeader
        title={`${contact.firstName} ${contact.lastName}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Contacts', href: '/contacts' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Contact',
          onClick: () => router.push(`/contacts/${contact.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Contact Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="First Name">{contact.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{contact.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{contact.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{contact.phone}</Descriptions.Item>
          <Descriptions.Item label="Role">{contact.role}</Descriptions.Item>
          <Descriptions.Item label="Customer">{contact.customerName}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
