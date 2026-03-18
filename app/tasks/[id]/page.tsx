'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { mockTasks } from '@/lib/mockData';

export default function ViewTaskPage() {
  const params = useParams();
  const router = useRouter();
  const task = mockTasks.find(t => t.id === params.id) || mockTasks[0];

  return (
    <div>
      <ModuleHeader
        title={task.title}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tasks', href: '/tasks' },
          { title: 'Details' },
        ]}
        backAction
        primaryAction={{
          label: 'Edit Task',
          onClick: () => router.push(`/tasks/${task.id}/edit`),
          icon: <EditOutlined />,
        }}
      />

      <Card bordered={false}>
        <Descriptions bordered>
          <Descriptions.Item label="Title" span={3}>{task.title}</Descriptions.Item>
          <Descriptions.Item label="Due Date">{task.dueDate}</Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={task.priority === 'HIGH' ? 'red' : 'blue'}>{task.priority}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="orange">{task.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Assigned User">{task.assignedUser}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
