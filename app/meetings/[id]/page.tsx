'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockMeetings } from '@/lib/mockData';

export default function ViewMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const meeting = mockMeetings.find(m => m.id === params.id) || mockMeetings[0];

  return (
    <div>
      <ModuleHeader
        title={meeting.title}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Meetings', href: '/meetings' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Meeting',
          onClick: () => router.push(`/meetings/${meeting.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions title="Meeting Information" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Subject">{meeting.title}</Descriptions.Item>
          <Descriptions.Item label="Date">{meeting.date}</Descriptions.Item>
          <Descriptions.Item label="Location">{meeting.location}</Descriptions.Item>
          <Descriptions.Item label="Related Contact">{meeting.contactName}</Descriptions.Item>
          <Descriptions.Item label="Participants" span={2}>{meeting.participants}</Descriptions.Item>
          <Descriptions.Item label="Notes" span={2}>{meeting.notes}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
