'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Row, Col, message, Spin } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataForm from '@/components/DataForm';
import { api } from '@/lib/api';

export default function EditVendorPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await api.get(`/modules/vendors/${params.id}`);
        form.setFieldsValue(response);
      } catch (error: any) {
        message.error(`Failed to fetch vendor: ${error.message}`);
        router.push('/vendors');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchVendor();
  }, [params.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/modules/vendors/${params.id}`, values);
      message.success('Vendor updated successfully');
      router.push(`/vendors/${params.id}`);
    } catch (error: any) {
      message.error(`Failed to update vendor: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div>
      <ModuleHeader
        title="Edit Vendor"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Vendors', href: '/vendors' },
          { title: 'Details', href: `/vendors/${params.id}` },
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
              name="name"
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </DataForm>
    </div>
  );
}
