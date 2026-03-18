'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockLeads } from '@/lib/mockData';

const { Option } = Select;

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const lead = mockLeads.find(l => l.id === params.id) || mockLeads[0];

  useEffect(() => {
    form.setFieldsValue(lead);
  }, [lead, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Lead updated successfully (mock)');
    router.push(`/leads/${lead.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Lead: ${lead.firstName} ${lead.lastName}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Leads', href: '/leads' },
          { title: 'Details', href: `/leads/${lead.id}` },
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
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="company"
              label="Company"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
            >
              <Select>
                <Option value="NEW">New</Option>
                <Option value="CONTACTED">Contacted</Option>
                <Option value="QUALIFIED">Qualified</Option>
                <Option value="LOST">Lost</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </DataForm>
    </div>
  );
}
