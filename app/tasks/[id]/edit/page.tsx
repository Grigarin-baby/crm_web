'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, DatePicker, Select, message, Spin } from 'antd';
import dayjs from 'dayjs';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskData, usersData, customersData] = await Promise.all([
          api.get(`/activity/tasks/${params.id}`),
          api.get('/core/users'),
          api.get('/modules/customers'),
        ]);
        setTask(taskData);
        setUsers(usersData.items || []);
        setCustomers(customersData.items || []);
        form.setFieldsValue({
          ...taskData,
          dueDate: taskData.dueDate ? dayjs(taskData.dueDate) : null,
        });
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchData();
    }
  }, [params.id, form]);

  const onFinish = async (values: any) => {
    try {
      await api.patch(`/activity/tasks/${params.id}`, values);
      message.success('Task updated successfully');
      router.push(`/tasks/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update task: ${error.message}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <ModuleHeader
        title={`Edit Task: ${task?.title}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tasks', href: '/tasks' },
          { title: 'Details', href: `/tasks/${params.id}` },
          { title: 'Edit' },
        ]}
        backAction
      />
      
      <DataForm form={form} onFinish={onFinish} onCancel={() => router.back()}>
        <Form.Item name="title" label="Task Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="assignedUserId" label="Assigned User">
          <Select placeholder="Select User">
            {users.map(user => (
              <Option key={user.id} value={user.id}>{user.firstName} {user.lastName}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="customerId" label="Related Customer">
          <Select placeholder="Select Customer" allowClear>
            {customers.map(customer => (
              <Option key={customer.id} value={customer.id}>{customer.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Option value="TODO">To Do</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Select>
            <Option value="HIGH">High</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="LOW">Low</Option>
          </Select>
        </Form.Item>
      </DataForm>
    </div>
  );
}
