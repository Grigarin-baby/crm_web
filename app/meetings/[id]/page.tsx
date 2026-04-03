'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await api.get(`/activity/meetings/${params.id}`);
        setMeeting(response);
      } catch (error: any) {
        message.error(`Failed to fetch meeting: ${error.message}`);
        router.push('/meetings');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchMeeting();
  }, [params.id, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!meeting) return null;

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
        <Descriptions title="Meeting Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Subject">{meeting.title}</Descriptions.Item>
          <Descriptions.Item label="Date">{new Date(meeting.date).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Location">{meeting.location || '-'}</Descriptions.Item>
          <Descriptions.Item label="Participants">{meeting.participants || '-'}</Descriptions.Item>
          <Descriptions.Item label="Contact">{meeting.contact ? `${meeting.contact.firstName} ${meeting.contact.lastName}` : '-'}</Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(meeting.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
