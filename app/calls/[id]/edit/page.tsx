'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, InputNumber, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockCalls, mockContacts } from '@/lib/mockData';

const { Option } = Select;
const { TextArea } = Input;

export default function EditCallPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const call = mockCalls.find(c => c.id === params.id) || mockCalls[0];

  useEffect(() => {
    form.setFieldsValue(call);
  }, [call, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Call updated successfully (mock)');
    router.push(`/calls/${call.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Call: ${call.id}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Calls', href: '/calls' },
          { title: 'Details', href: `/calls/${call.id}` },
          { title: 'Edit' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.back()}
        submitLabel="Save Changes"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="callType"
              label="Call Type"
              rules={[{ required: true, message: 'Please select call type' }]}
            >
              <Select>
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
              <Select>
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
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
