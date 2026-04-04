'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, TablePaginationConfig, Drawer } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';
import CallForm from '@/components/forms/CallForm';

export default function CallsPage() {
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

  const fetchCalls = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/activity/calls?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch calls: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalls(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchCalls]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchCalls(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/activity/calls/${record.id}`);
      message.success('Call deleted successfully');
      fetchCalls(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete call: ${error.message}`);
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
    fetchCalls(pagination.current || 1, pagination.pageSize || 10);
  };

  const columns = [
    {
      title: 'Call Type',
      dataIndex: 'callType',
      key: 'callType',
    },
    {
      title: 'Contact',
      dataIndex: ['contact', 'firstName'],
      key: 'contactName',
      render: (text: string, record: any) => record.contact ? `${record.contact.firstName} ${record.contact.lastName}` : '-',
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Calls"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Calls' },
        ]}
        primaryAction={{
          label: 'Log Call',
          onClick: () => openDrawer(),
          icon: <PhoneOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/calls/${record.id}`)}
        onEdit={(record) => openDrawer(record.id)}
        onDelete={handleDelete}
      />
      
      <Drawer
        title={editingId ? "Edit Call" : "Log Call"}
        width={720}
        onClose={closeDrawer}
        open={drawerOpen}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <CallForm 
          id={editingId} 
          onSuccess={handleSuccess} 
          onCancel={closeDrawer} 
        />
      </Drawer>
    </div>
  );
}
