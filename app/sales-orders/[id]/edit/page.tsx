'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockSalesOrders, mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function EditSalesOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const order = mockSalesOrders.find(so => so.id === params.id) || mockSalesOrders[0];

  useEffect(() => {
    form.setFieldsValue(order);
  }, [order, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Sales Order updated successfully (mock)');
    router.push(`/sales-orders/${order.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Sales Order: ${order.orderNumber}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Sales Orders', href: '/sales-orders' },
          { title: 'Details', href: `/sales-orders/${order.id}` },
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
              name="orderNumber"
              label="Order Number"
              rules={[{ required: true, message: 'Please enter order number' }]}
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="orderStatus"
              label="Order Status"
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
