'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag, TablePaginationConfig, Drawer } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';
import InvoiceForm from '@/components/forms/InvoiceForm';

export default function InvoicesPage() {
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

  const fetchInvoices = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const response = await api.get(`/modules/invoices?skip=${skip}&take=${pageSize}`);
      setData(response.items);
      setPagination(prev => ({
        ...prev,
        current,
        pageSize,
        total: response.total,
      }));
    } catch (error: any) {
      message.error(`Failed to fetch invoices: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices(pagination.current || 1, pagination.pageSize || 10);
  }, [fetchInvoices]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchInvoices(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/modules/invoices/${record.id}`);
      message.success('Invoice deleted successfully');
      fetchInvoices(pagination.current || 1, pagination.pageSize || 10);
    } catch (error: any) {
      message.error(`Failed to delete invoice: ${error.message}`);
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
    fetchInvoices(pagination.current || 1, pagination.pageSize || 10);
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'PAID') color = 'green';
        if (status === 'OVERDUE') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Invoices"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Invoices' },
        ]}
        primaryAction={{
          label: 'Create Invoice',
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
        onView={(record) => router.push(`/invoices/${record.id}`)}
        onEdit={(record) => openDrawer(record.id)}
        onDelete={handleDelete}
      />
      
      <Drawer
        title={editingId ? "Edit Invoice" : "Create Invoice"}
        width={720}
        onClose={closeDrawer}
        open={drawerOpen}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <InvoiceForm 
          id={editingId} 
          onSuccess={handleSuccess} 
          onCancel={closeDrawer} 
        />
      </Drawer>
    </div>
  );
}
