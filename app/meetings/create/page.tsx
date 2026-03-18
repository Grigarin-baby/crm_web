'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, DatePicker, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockContacts } from '@/lib/mockData';

const { Option } = Select;
const { TextArea } = Input;

export default function CreateMeetingPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Meeting scheduled successfully (mock)');
    router.push('/meetings');
  };

  return (
    <div>
      <ModuleHeader
        title="Schedule Meeting"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Meetings', href: '/meetings' },
          { title: 'Schedule' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/meetings')}
        submitLabel="Schedule Meeting"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Subject"
              rules={[{ required: true, message: 'Please enter subject' }]}
            >
              <Input placeholder="e.g. Project Review" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Date & Time"
              rules={[{ required: true, message: 'Please select date and time' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label="Location"
            >
              <Input placeholder="e.g. Zoom, Office" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="participants"
              label="Participants"
            >
              <Input placeholder="e.g. John, Jane" />
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
          <Col span={24}>
            <Form.Item
              name="notes"
              label="Notes"
            >
              <TextArea rows={4} placeholder="Meeting agenda and notes..." />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
