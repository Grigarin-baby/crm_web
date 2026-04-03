'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message, Spin, InputNumber } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

const { Option } = Select;
const { TextArea } = Input;

export default function EditCallPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callRes, contactsRes] = await Promise.all([
          api.get(`/activity/calls/${params.id}`),
          api.get('/modules/contacts?take=100'),
        ]);
        setContacts(contactsRes.items);
        form.setFieldsValue(callRes);
      } catch (error: any) {
        message.error(`Failed to fetch data: ${error.message}`);
        router.push('/calls');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/activity/calls/${params.id}`, values);
      message.success('Call updated successfully');
      router.push(`/calls/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update call: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Call Log"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Calls', href: '/calls' },
          { title: 'Details', href: `/calls/${params.id}` },
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
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
