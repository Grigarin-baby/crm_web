'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, message, TablePaginationConfig, Drawer } from 'antd';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';
import LeadForm from '@/components/forms/LeadForm';

export default function LeadsPage() {
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

  const fetchLeads = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/modules/leads?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch leads: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchLeads]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchLeads(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/modules/leads/${record.id}`);
      message.success('Lead deleted successfully');
      fetchLeads(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete lead: ${error.message}`);
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
    fetchLeads(pagination.current || 1, pagination.pageSize || 10);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text: string, record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'NEW' ? 'blue' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
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
        title="Leads"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Leads' },
        ]}
        primaryAction={{
          label: 'Create Lead',
          onClick: () => openDrawer(),
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/leads/${record.id}`)}
        onEdit={(record) => openDrawer(record.id)}
        onDelete={handleDelete}
      />
      
      <Drawer
        title={editingId ? "Edit Lead" : "Create Lead"}
        width={720}
        onClose={closeDrawer}
        open={drawerOpen}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <LeadForm 
          id={editingId} 
          onSuccess={handleSuccess} 
          onCancel={closeDrawer} 
        />
      </Drawer>
    </div>
  );
}
