'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockContacts, mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const contact = mockContacts.find(c => c.id === params.id) || mockContacts[0];

  useEffect(() => {
    form.setFieldsValue(contact);
  }, [contact, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Contact updated successfully (mock)');
    router.push(`/contacts/${contact.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Contact: ${contact.firstName} ${contact.lastName}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Contacts', href: '/contacts' },
          { title: 'Details', href: `/contacts/${contact.id}` },
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select>
                {mockCustomers.map(customer => (
                  <Option key={customer.id} value={customer.name}>{customer.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
