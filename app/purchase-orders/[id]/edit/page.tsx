'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, message, Spin, Result, Button } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

const { Option } = Select;

export default function EditPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderData, vendorsData] = await Promise.all([
          api.get(`/purchase-orders/${params.id}`),
          api.get('/vendors')
        ]);
        
        setVendors(vendorsData);
        
        // Prepare form data
        const formData = {
          ...orderData,
          expectedDate: orderData.expectedDate ? dayjs(orderData.expectedDate) : null
        };
        form.setFieldsValue(formData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch purchase order details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, form]);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      // Format date for API
      if (values.expectedDate) {
        values.expectedDate = values.expectedDate.toISOString();
      }
      
      await api.patch(`/purchase-orders/${params.id}`, values);
      message.success('Purchase Order updated successfully');
      router.push(`/purchase-orders/${params.id}`);
    } catch (err: any) {
      console.error('Error updating purchase order:', err);
      message.error(err.message || 'Failed to update purchase order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" description="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Error Loading Purchase Order"
        subTitle={error}
        extra={[
          <Button type="primary" key="back" onClick={() => router.push('/purchase-orders')}>
            Back to Purchase Orders
          </Button>
        ]}
      />
    );
  }

  return (
    <div>
      <ModuleHeader
        title={`Edit Purchase Order: ${form.getFieldValue('poNumber')}`}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Purchase Orders', href: '/purchase-orders' },
          { title: 'Details', href: `/purchase-orders/${params.id}` },
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
              name="poNumber"
              label="PO Number"
              rules={[{ required: true, message: 'Please enter PO number' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vendorId"
              label="Vendor"
              rules={[{ required: true, message: 'Please select a vendor' }]}
            >
              <Select placeholder="Select vendor">
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
