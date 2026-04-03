'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, DatePicker, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export default function CreateMeetingPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        const data = await api.get('/contacts');
        setContacts(data);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
        message.error('Failed to load contacts');
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      // Format date for API
      if (values.date) {
        values.date = values.date.toISOString();
      }
      
      await api.post('/meetings', values);
      message.success('Meeting scheduled successfully');
      router.push('/meetings');
    } catch (err: any) {
      console.error('Error scheduling meeting:', err);
      message.error(err.message || 'Failed to schedule meeting');
    } finally {
      setSubmitting(false);
    }
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
        loading={submitting}
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
              name="contactId"
              label="Related Contact"
              rules={[{ required: true, message: 'Please select a contact' }]}
            >
              <Select placeholder="Select contact" loading={loadingContacts}>
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
