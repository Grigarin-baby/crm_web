'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function CreateInvoicePage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Invoice created successfully (mock)');
    router.push('/invoices');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Invoice"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Invoices', href: '/invoices' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/invoices')}
        submitLabel="Create Invoice"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="invoiceNumber"
              label="Invoice Number"
              rules={[{ required: true, message: 'Please enter invoice number' }]}
            >
              <Input placeholder="e.g. INV-2026-901" />
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
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="invoiceDate"
              label="Invoice Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="paymentStatus"
              label="Payment Status"
              initialValue="UNPAID"
            >
              <Select>
                <Option value="UNPAID">UNPAID</Option>
                <Option value="PAID">PAID</Option>
                <Option value="OVERDUE">OVERDUE</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
