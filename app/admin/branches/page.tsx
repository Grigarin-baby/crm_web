'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, TablePaginationConfig, Drawer } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';
import BranchForm from '@/components/forms/BranchForm';

export default function BranchesPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
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

  const openDrawer = (id?: string) => {
    setEditingId(id);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(undefined);
  };

  const handleSuccess = () => {
    closeDrawer();
    fetchBranches(pagination.current || 1, pagination.pageSize || 10);
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
          onClick: () => openDrawer(),
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/admin/branches/${record.id}`)}
        onEdit={(record) => openDrawer(record.id)}
        onDelete={handleDelete}
      />
      
      <Drawer
        title={editingId ? "Edit Branch" : "Create Branch"}
        width={720}
        onClose={closeDrawer}
        open={drawerOpen}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <BranchForm 
          id={editingId} 
          onSuccess={handleSuccess} 
          onCancel={closeDrawer} 
        />
      </Drawer>
    </div>
  );
}
