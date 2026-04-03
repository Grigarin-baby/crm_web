'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, TablePaginationConfig } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';

export default function BranchesPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchBranches = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      // Since it's SaaS Admin, we call without organizationId header (handled by TenantGuard)
      const response = await api.get(`/core/branches?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch branches: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchBranches]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchBranches(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/core/branches/${record.id}`);
      message.success('Branch deleted successfully');
      fetchBranches(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete branch: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'Branch Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Organization ID',
      dataIndex: 'organizationId',
      key: 'organizationId',
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
        title="Global Branches"
        breadcrumbItems={[
          { title: 'SaaS Dashboard', href: '/' },
          { title: 'Branches' },
        ]}
        primaryAction={{
          label: 'Create Branch',
          onClick: () => router.push('/admin/branches/create'),
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/admin/branches/${record.id}`)}
        onEdit={(record) => router.push(`/admin/branches/${record.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
