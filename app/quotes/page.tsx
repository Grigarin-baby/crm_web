'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, TablePaginationConfig, Drawer } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';
import QuoteForm from '@/components/forms/QuoteForm';

export default function QuotesPage() {
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

  const fetchQuotes = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/modules/quotes?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch quotes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchQuotes]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchQuotes(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/modules/quotes/${record.id}`);
      message.success('Quote deleted successfully');
      fetchQuotes(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete quote: ${error.message}`);
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
    fetchQuotes(pagination.current || 1, pagination.pageSize || 10);
  };

  const columns = [
    {
      title: 'Quote Number',
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => customer?.name || '-',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Deal',
      dataIndex: 'deal',
      key: 'deal',
      render: (deal: any) => deal?.name || '-',
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Quotes"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Quotes' },
        ]}
        primaryAction={{
          label: 'Create Quote',
          onClick: () => openDrawer(),
          icon: <FileTextOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={(record) => router.push(`/quotes/${record.id}`)}
        onEdit={(record) => openDrawer(record.id)}
        onDelete={handleDelete}
      />
      
      <Drawer
        title={editingId ? "Edit Quote" : "Create Quote"}
        width={720}
        onClose={closeDrawer}
        open={drawerOpen}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <QuoteForm 
          id={editingId} 
          onSuccess={handleSuccess} 
          onCancel={closeDrawer} 
        />
      </Drawer>
    </div>
  );
}
