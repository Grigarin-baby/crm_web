'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface TaskFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({ id, onSuccess, onCancel }: TaskFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/core/users?take=100');
        setUsers(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch users: ${error.message}`);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/activity/tasks/${id}`);
          if (response.dueDate) {
            response.dueDate = dayjs(response.dueDate);
          }
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch task: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };

      if (id) {
        await api.patch(`/activity/tasks/${id}`, data);
        message.success('Task updated successfully');
      } else {
        await api.post('/activity/tasks', data);
        message.success('Task created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save task: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <DataForm 
      form={form} 
      onFinish={onFinish} 
      onCancel={onCancel}
      submitLabel={id ? "Save Changes" : "Create Task"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="title" label="Task Title" rules={[{ required: true }]}>
            <Input placeholder="What needs to be done?" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="priority" label="Priority" initialValue="MEDIUM">
            <Select>
              <Option value="HIGH">High</Option>
              <Option value="MEDIUM">Medium</Option>
              <Option value="LOW">Low</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="assignedUserId" label="Assign To">
            <Select placeholder="Select a user" allowClear>
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {id && (
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="TODO">TODO</Option>
                <Option value="IN_PROGRESS">IN PROGRESS</Option>
                <Option value="COMPLETED">COMPLETED</Option>
              </Select>
            </Form.Item>
          </Col>
        )}
      </Row>
    </DataForm>
  );
}
