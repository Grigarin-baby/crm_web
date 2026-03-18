'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockVendors } from '@/lib/mockData';

const { Option } = Select;

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    message.success('Purchase Order created successfully (mock)');
    router.push('/purchase-orders');
  };

  return (
    <div>
      <ModuleHeader
        title="Create New Purchase Order"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Purchase Orders', href: '/purchase-orders' },
          { title: 'Create' },
        ]}
        backAction
      />
      
      <DataForm 
        form={form} 
        onFinish={onFinish} 
        onCancel={() => router.push('/purchase-orders')}
        submitLabel="Create PO"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="poNumber"
              label="PO Number"
              rules={[{ required: true, message: 'Please enter PO number' }]}
            >
              <Input placeholder="e.g. PO-2026-701" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vendorName"
              label="Vendor"
              rules={[{ required: true, message: 'Please select a vendor' }]}
            >
              <Select placeholder="Select vendor">
                {mockVendors.map(vendor => (
                  <Option key={vendor.id} value={vendor.name}>{vendor.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="totalAmount"
              label="Total Amount"
              rules={[{ required: true, message: 'Please enter total amount' }]}
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
              name="expectedDate"
              label="Expected Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              initialValue="DRAFT"
            >
              <Select>
                <Option value="DRAFT">DRAFT</Option>
                <Option value="ISSUED">ISSUED</Option>
                <Option value="RECEIVED">RECEIVED</Option>
                <Option value="CANCELLED">CANCELLED</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
