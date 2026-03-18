'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, DatePicker, Select, message } from 'antd';
import dayjs from 'dayjs';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockTasks } from '@/lib/mockData';

const { Option } = Select;

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const task = mockTasks.find(t => t.id === params.id) || mockTasks[0];

  useEffect(() => {
    form.setFieldsValue({
      ...task,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null,
    });
  }, [task, form]);

  const onFinish = (values: any) => {
    console.log('Task updated:', values);
    message.success('Task updated successfully (mock)');
    router.push(`/tasks/${task.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Task: ${task.title}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Tasks', href: '/tasks' },
          { title: 'Details', href: `/tasks/${task.id}` },
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
