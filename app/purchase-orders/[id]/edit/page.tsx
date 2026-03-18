'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { mockPurchaseOrders, mockVendors } from '@/lib/mockData';

const { Option } = Select;

export default function EditPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const order = mockPurchaseOrders.find(po => po.id === params.id) || mockPurchaseOrders[0];

  useEffect(() => {
    form.setFieldsValue(order);
  }, [order, form]);

  const onFinish = (values: any) => {
    console.log('Updated values:', values);
    message.success('Purchase Order updated successfully (mock)');
    router.push(`/purchase-orders/${order.id}`);
  };

  return (
    <div>
      <ModuleHeader
        title={`Edit Purchase Order: ${order.poNumber}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Purchase Orders', href: '/purchase-orders' },
          { title: 'Details', href: `/purchase-orders/${order.id}` },
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
              name="poNumber"
              label="PO Number"
              rules={[{ required: true, message: 'Please enter PO number' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vendorName"
              label="Vendor"
              rules={[{ required: true, message: 'Please select a vendor' }]}
            >
              <Select>
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
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
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
