'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockMeetings } from '@/lib/mockData';

export default function MeetingsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Related Contact',
      dataIndex: 'contactName',
      key: 'contactName',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Meetings"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Meetings' },
        ]}
        primaryAction={{
          label: 'Create Meeting',
          onClick: () => router.push('/meetings/create'),
          icon: <VideoCameraOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={mockMeetings}
        onView={(record) => router.push(`/meetings/${record.id}`)}
        onEdit={(record) => router.push(`/meetings/${record.id}/edit`)}
        onDelete={(record) => message.success(`Meeting ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
