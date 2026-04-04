'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;

interface TicketFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TicketForm({ id, onSuccess, onCancel }: TicketFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/modules/customers?take=100');
        setCustomers(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch customers: ${error.message}`);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/service/tickets/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch ticket: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchTicket();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/service/tickets/${id}`, values);
        message.success('Ticket updated successfully');
      } else {
        await api.post('/service/tickets', values);
        message.success('Ticket created successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save ticket: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Create Ticket"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="ticketId" label="Ticket ID" rules={[{ required: true }]}>
            <Input placeholder="e.g. TKT-1002" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
            <Select placeholder="Select customer" allowClear>
              {customers.map(customer => (
                <Option key={customer.id} value={customer.id}>{customer.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="category" label="Category">
            <Select placeholder="Select category">
              <Option value="Technical">Technical</Option>
              <Option value="Billing">Billing</Option>
              <Option value="Feature Request">Feature Request</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="priority" label="Priority" initialValue="MEDIUM">
            <Select>
              <Option value="URGENT">Urgent</Option>
              <Option value="HIGH">High</Option>
              <Option value="MEDIUM">Medium</Option>
              <Option value="LOW">Low</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {id && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="OPEN">Open</Option>
                <Option value="IN_PROGRESS">In Progress</Option>
                <Option value="RESOLVED">Resolved</Option>
                <Option value="CLOSED">Closed</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label="Problem Description">
            <Input.TextArea rows={4} placeholder="Describe the issue in detail..." />
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}
