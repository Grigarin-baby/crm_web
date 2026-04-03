'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewContactPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await api.get(`/modules/contacts/${params.id}`);
        setContact(response);
      } catch (error: any) {
        message.error(`Failed to fetch contact: ${error.message}`);
        router.push('/contacts');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchContact();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!contact) return null;

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
          <Descriptions.Item label="Customer">{contact.customer?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(contact.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
