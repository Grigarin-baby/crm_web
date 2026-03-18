'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { ContactsOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockContacts } from '@/lib/mockData';

export default function ContactsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text: string, record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Contacts"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Contacts' },
        ]}
        primaryAction={{
          label: 'Create Contact',
          onClick: () => router.push('/contacts/create'),
          icon: <ContactsOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockContacts}
        onView={(record) => router.push(`/contacts/${record.id}`)}
        onEdit={(record) => router.push(`/contacts/${record.id}/edit`)}
        onDelete={(record) => message.success(`Contact ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
