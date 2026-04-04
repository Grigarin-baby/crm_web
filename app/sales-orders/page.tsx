'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message, Tag, Drawer } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import ModuleHeader from '@/components/ModuleHeader';
import DataTable from '@/components/DataTable';
import { api } from '@/lib/api';
import SalesOrderForm from '@/components/forms/SalesOrderForm';

export default function SalesOrdersPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchData = useCallback(async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const skip = (current - 1) * pageSize;
      const take = pageSize;
      const response = await api.get(`/modules/sales-orders?skip=${skip}&take=${take}`);
      setData(response.items || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch sales orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [fetchData, pagination]);

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`/modules/sales-orders/${record.id}`);
      message.success('Sales Order deleted successfully');
      fetchData(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.message || 'Failed to delete sales order');
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
    fetchData(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
      render: (text: string, record: any) => text || record.customerName || 'N/A',
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'CONFIRMED') color = 'green';
        if (status === 'DELIVERED') color = 'cyan';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'PAID') color = 'green';
        if (status === 'PARTIAL') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <ModuleHeader
        title="Sales Orders"
        breadcrumbItems={[
          { title: 'Dashboard', href: '/' },
          { title: 'Sales Orders' },
        ]}
        primaryAction={{
          label: 'Create Order',
          onClick: () => openDrawer(),
          icon: <ShoppingCartOutlined />,
        }}
      />
      <DataTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          total,
        }}
        onChange={handleTableChange}
        onView={(record) => router.push(`/sales-orders/${record.id}`)}
        onEdit={(record) => openDrawer(record.id)}
        onDelete={handleDelete}
      />
      
      <Drawer
        title={editingId ? "Edit Sales Order" : "Create Sales Order"}
        width={720}
        onClose={closeDrawer}
        open={drawerOpen}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <SalesOrderForm 
          id={editingId} 
          onSuccess={handleSuccess} 
          onCancel={closeDrawer} 
        />
      </Drawer>
    </div>
  );
}
