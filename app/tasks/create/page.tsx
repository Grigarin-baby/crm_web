'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, DatePicker, Select, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';

const { Option } = Select;

export default function CreateTaskPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Task created:', values);
    message.success('Task created successfully (mock)');
    router.push('/tasks');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Task"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tasks', href: '/tasks' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm form={form} onFinish={onFinish} onCancel={() => router.push('/tasks')}>
        <Form.Item name="title" label="Task Title" rules={[{ required: true }]}>
          <Input placeholder="What needs to be done?" />
        </Form.Item>
        
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="priority" label="Priority" initialValue="MEDIUM">
          <Select>
            <Option value="HIGH">High</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="LOW">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item name="assignedUser" label="Assign To">
          <Select placeholder="Select a user">
            <Option value="John Admin">John Admin</Option>
            <Option value="Jane Sales">Jane Sales</Option>
          </Select>
        </Form.Item>
      </DataForm>
    </div>
  );
}
