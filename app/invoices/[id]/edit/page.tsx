'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockInvoices, mockCustomers } from '@/lib/mockData';

const { Option } = Select;

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const invoice = mockInvoices.find(inv => inv.id === params.id) || mockInvoices[0];

  useEffect(() => {
    form.setFieldsValue(invoice);
  }, [invoice, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Invoice updated successfully (mock)');
    router.push(`/invoices/${invoice.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Invoice: ${invoice.invoiceNumber}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Invoices', href: '/invoices' },
          { title: 'Details', href: `/invoices/${invoice.id}` },
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
              name="invoiceNumber"
              label="Invoice Number"
              rules={[{ required: true, message: 'Please enter invoice number' }]}
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
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="paymentStatus"
              label="Payment Status"
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
