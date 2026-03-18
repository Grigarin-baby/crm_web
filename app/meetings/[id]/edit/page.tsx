'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockMeetings, mockContacts } from '@/lib/mockData';

const { Option } = Select;
const { TextArea } = Input;

export default function EditMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const meeting = mockMeetings.find(m => m.id === params.id) || mockMeetings[0];

  useEffect(() => {
    form.setFieldsValue({
      ...meeting,
      date: meeting.date ? dayjs(meeting.date) : null,
    });
  }, [meeting, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Meeting updated successfully (mock)');
    router.push(`/meetings/${meeting.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Meeting: ${meeting.title}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Meetings', href: '/meetings' },
          { title: 'Details', href: `/meetings/${meeting.id}` },
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
          <Col span={24}>
            <Form.Item
              name="title"
              label="Subject"
              rules={[{ required: true, message: 'Please enter subject' }]}
            >
              <Input />
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
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="participants"
              label="Participants"
            >
              <Input />
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
          <Col span={24}>
            <Form.Item
              name="notes"
              label="Notes"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
