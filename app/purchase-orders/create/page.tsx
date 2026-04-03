'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

const { Option } = Select;

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        const data = await api.get('/vendors');
        setVendors(data);
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
        message.error('Failed to load vendors');
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      // Format date for API
      if (values.expectedDate) {
        values.expectedDate = values.expectedDate.toISOString();
      }
      
      await api.post('/purchase-orders', values);
      message.success('Purchase Order created successfully');
      router.push('/purchase-orders');
    } catch (err: any) {
      console.error('Error creating purchase order:', err);
      message.error(err.message || 'Failed to create purchase order');
    } finally {
      setSubmitting(false);
    }
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
        loading={submitting}
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
              name="vendorId"
              label="Vendor"
              rules={[{ required: true, message: 'Please select a vendor' }]}
            >
              <Select placeholder="Select vendor" loading={loadingVendors}>
                {vendors.map(vendor => (
                  <Option key={vendor.id} value={vendor.id}>{vendor.name}</Option>
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
                parser={value => value!.replace(/\$\s?|(,*)/g, '') as unknown as 0}
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
              initialValue="PENDING"
            >
              <Select>
                <Option value="PENDING">PENDING</Option>
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
