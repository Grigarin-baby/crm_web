'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag, TablePaginationConfig } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';

export default function TasksPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTasks = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/activity/tasks?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchTasks]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchTasks(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/activity/tasks/${record.id}`);
      message.success('Task deleted successfully');
      fetchTasks(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete task: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'COMPLETED') color = 'green';
        if (status === 'IN_PROGRESS') color = 'orange';
        if (status === 'TODO') color = 'cyan';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = 'default';
        if (priority === 'HIGH') color = 'red';
        if (priority === 'MEDIUM') color = 'gold';
        if (priority === 'LOW') color = 'green';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Assigned User',
      dataIndex: ['assignedUser', 'firstName'],
      key: 'assignedUser',
      render: (text: string, record: any) => record.assignedUser ? `${record.assignedUser.firstName} ${record.assignedUser.lastName}` : '-',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Tasks"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tasks' },
        ]}
        primaryAction={{
          label: 'Create Task',
          onClick: () => router.push('/tasks/create'),
          icon: <CheckSquareOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/tasks/${record.id}`)}
        onEdit={(record) => router.push(`/tasks/${record.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
