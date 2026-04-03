'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import { api } from '@/lib/api';

export default function ViewTaskPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await api.get(`/activity/tasks/${params.id}`);
        setTask(data);
      } catch (error: any) {
        message.error(`Failed to fetch task: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!task) {
    return <Card>Task not found</Card>;
  }

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
          <Descriptions.Item label="Due Date">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={task.priority === 'HIGH' ? 'red' : 'blue'}>{task.priority}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="orange">{task.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Assigned User">
            {task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Related To">
            {task.customer ? `Customer: ${task.customer.name}` : task.deal ? `Deal: ${task.deal.title}` : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
