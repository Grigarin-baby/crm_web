'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, DatePicker, message, Spin } from 'antd';
import dayjs from 'dayjs';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;
const { TextArea } = Input;

interface MeetingFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MeetingForm({ id, onSuccess, onCancel }: MeetingFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await api.get('/modules/contacts?take=100');
        setContacts(data.items || []);
      } catch (err) {
        message.error('Failed to load contacts');
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchMeeting = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/activity/meetings/${id}`);
          if (response.date) {
            response.date = dayjs(response.date);
          }
          form.setFieldsValue(response);
        } catch (error: any) {
          message.error(`Failed to fetch meeting: ${error.message}`);
          onCancel();
        } finally {
          setLoading(false);
        }
      };
      fetchMeeting();
    } else {
      form.resetFields();
    }
  }, [id, form, onCancel]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        date: values.date ? values.date.toISOString() : null,
      };

      if (id) {
        await api.patch(`/activity/meetings/${id}`, data);
        message.success('Meeting updated successfully');
      } else {
        await api.post('/activity/meetings', data);
        message.success('Meeting scheduled successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(`Failed to save meeting: ${error.message}`);
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
      submitLabel={id ? "Save Changes" : "Schedule Meeting"}
      loading={submitting}
      inDrawer={true}
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
  );
}
