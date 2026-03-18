'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function CreateSalesOrderPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Sales Order created successfully (mock)');
    router.push('/sales-orders');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Sales Order"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Sales Orders', href: '/sales-orders' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/sales-orders')}
        submitLabel="Create Order"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="orderNumber"
              label="Order Number"
              rules={[{ required: true, message: 'Please enter order number' }]}
            >
              <Input placeholder="e.g. SO-2026-501" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select placeholder="Select customer">
                {mockCustomers.map(customer => (
                  <Option key={customer.id} value={customer.name}>{customer.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="orderStatus"
              label="Order Status"
              initialValue="DRAFT"
            >
              <Select>
                <Option value="DRAFT">DRAFT</Option>
                <Option value="CONFIRMED">CONFIRMED</Option>
                <Option value="SHIPPED">SHIPPED</Option>
                <Option value="DELIVERED">DELIVERED</Option>
                <Option value="CANCELLED">CANCELLED</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="paymentStatus"
              label="Payment Status"
              initialValue="PENDING"
            >
              <Select>
                <Option value="PENDING">PENDING</Option>
                <Option value="PAID">PAID</Option>
                <Option value="PARTIAL">PARTIAL</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
