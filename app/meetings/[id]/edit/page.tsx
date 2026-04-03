'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message, Spin, DatePicker } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

const { Option } = Select;

export default function EditMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingRes, contactsRes] = await Promise.all([
          api.get(`/activity/meetings/${params.id}`),
          api.get('/modules/contacts?take=100'),
        ]);
        setContacts(contactsRes.items);
        form.setFieldsValue({
          ...meetingRes,
          date: meetingRes.date ? dayjs(meetingRes.date) : null,
        });
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
        router.push('/meetings');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        date: values.date ? values.date.toISOString() : null,
      };
      await api.patch(`/activity/meetings/${params.id}`, data);
      message.success('Meeting updated successfully');
      router.push(`/meetings/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update meeting: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Meeting"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Meetings', href: '/meetings' },
          { title: 'Details', href: `/meetings/${params.id}` },
          { title: 'Edit' },
        ]}
        backAction
      />

      <DataForm
        form={form}
        onFinish={onFinish}
        onCancel={() => router.back()}
        submitLabel="Save Changes"
        loading={submitting}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Subject"
              rules={[{ required: true, message: 'Please enter meeting subject' }]}
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
              <Input placeholder="e.g. Zoom, Office" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
          <Col span={12}>
            <Form.Item
              name="participants"
              label="Participants"
            >
              <Input placeholder="e.g. John Doe, Sarah Smith" />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
