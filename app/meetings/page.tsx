'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, TablePaginationConfig } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';

export default function MeetingsPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchMeetings = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/activity/meetings?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch meetings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchMeetings]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchMeetings(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/activity/meetings/${record.id}`);
      message.success('Meeting deleted successfully');
      fetchMeetings(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete meeting: ${error.message}`);
    }
  };

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
      render: (date: string) => new Date(date).toLocaleString(),
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
      dataIndex: ['contact', 'firstName'],
      key: 'contactName',
      render: (text: string, record: any) => record.contact ? `${record.contact.firstName} ${record.contact.lastName}` : '-',
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
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/meetings/${record.id}`)}
        onEdit={(record) => router.push(`/meetings/${record.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
