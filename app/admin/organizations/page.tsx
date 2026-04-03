'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, message, TablePaginationConfig } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';

export default function OrganizationsPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchOrganizations = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/core/organizations?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch organizations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchOrganizations]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchOrganizations(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/core/organizations/${record.id}`);
      message.success('Organization deleted successfully');
      fetchOrganizations(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete organization: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: 'Subscription',
      dataIndex: 'subscriptionPlan',
      key: 'subscriptionPlan',
      render: (plan: string) => (
        <Tag color={plan === 'ENTERPRISE' ? 'purple' : (plan === 'PRO' ? 'blue' : 'default')}>
          {plan}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Organizations (Tenants)"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Organizations' },
        ]}
        primaryAction={{
          label: 'Create Organization',
          onClick: () => router.push('/admin/organizations/create'),
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/admin/organizations/${record.id}`)}
        onEdit={(record) => router.push(`/admin/organizations/${record.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
