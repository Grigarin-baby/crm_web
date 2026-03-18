'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { mockTasks } from '@/lib/mockData';

export default function TasksPage() {
  const router = useRouter();

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
      dataIndex: 'assignedUser',
      key: 'assignedUser',
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
        dataSource={mockTasks}
        onView={(record) => router.push(`/tasks/${record.id}`)}
        onEdit={(record) => router.push(`/tasks/${record.id}/edit`)}
        onDelete={(record) => message.success(`Task ${record.id} deleted (mock)`)}
      />
    </div>
  );
}
