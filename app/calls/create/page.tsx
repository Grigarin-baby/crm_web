'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, InputNumber, message } from 'antd';   
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;
const { TextArea } = Input;

export default function LogCallPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/modules/contacts?take=100');
        setContacts(response.items);
      } catch (error: any) {
        message.error(`Failed to fetch contacts: ${error.message}`);
      }
    };
    fetchContacts();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.post('/activity/calls', values);
      message.success('Call logged successfully');
      router.push('/calls');
    } catch (error: any) {
      message.error(`Failed to log call: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ModuleHeader
        title="Log Call"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Calls', href: '/calls' },
          { title: 'Log' },
        ]}
        backAction
      />

      <DataForm
        form={form}
        onFinish={onFinish}
        onCancel={() => router.push('/calls')}
        submitLabel="Log Call"
        loading={submitting}
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
    </div>
  );
}
