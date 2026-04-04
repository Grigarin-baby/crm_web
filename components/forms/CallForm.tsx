'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, InputNumber, message, Spin } from 'antd';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;
const { TextArea } = Input;

interface CallFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CallForm({ id, onSuccess, onCancel }: CallFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/modules/contacts?take=100');
        setContacts(response.items || []);
      } catch (error: any) {
        message.error(`Failed to fetch contacts: ${error.message}`);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchCall = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/activity/calls/${id}`);
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch call: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchCall();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/activity/calls/${id}`, values);
        message.success('Call updated successfully');
      } else {
        await api.post('/activity/calls', values);
        message.success('Call logged successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to log call: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Log Call"}
      loading={submitting}
      inDrawer={true}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="callType"
            label="Call Type"
            rules={[{ required: true, message: 'Please select call type' }]}
          >
            <Select placeholder="Select type">
              <Option value="Inbound">Inbound</Option>
              <Option value="Outbound">Outbound</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="contactId"
            label="Related Contact"
          >
            <Select placeholder="Select contact" allowClear>
              {contacts.map(contact => (
                <Option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="summary"
            label="Call Summary"
          >
            <TextArea rows={4} placeholder="Summary of the conversation..." />
          </Form.Item>
        </Col>
      </Row>
    </DataForm>
  );
}
