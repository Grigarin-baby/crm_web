'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, InputNumber, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockContacts } from '@/lib/mockData';

const { Option } = Select;
const { TextArea } = Input;

export default function LogCallPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Call logged successfully (mock)');
    router.push('/calls');
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
              name="contactName"
              label="Related Contact"
              rules={[{ required: true, message: 'Please select a contact' }]}
            >
              <Select placeholder="Select contact">
                {mockContacts.map(contact => (
                  <Option key={contact.id} value={`${contact.firstName} ${contact.lastName}`}>
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
