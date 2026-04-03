'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { api } from '@/lib/api';
import { setCredentials, logout } from '@/store/authSlice';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');

      if (!isAuthenticated && refreshToken && userId) {
        try {
          // Attempt to restore session using refresh token
          const response = await api.post('/core/auth/refresh', {
            userId,
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token, user } = response;
          
          dispatch(setCredentials({
            accessToken: access_token,
            user: {
              id: user.id,
              email: user.email,
              organizationId: user.organizationId,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
              organization: user.organization,
              branch: user.branch,
            },
          }));

          localStorage.setItem('refreshToken', refresh_token);
        } catch (error) {
          console.error('Failed to restore session:', error);
          dispatch(logout());
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      } else if (!isAuthenticated && !refreshToken && pathname !== '/login') {
        router.push('/login');
      }

      setIsInitializing(false);
    };

    initAuth();
  }, [dispatch, isAuthenticated, pathname, router]);

  // Handle redirect if not authenticated after initialization
  useEffect(() => {
    if (!isInitializing && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    // If authenticated and on login page, redirect to dashboard
    if (!isInitializing && isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [isInitializing, isAuthenticated, pathname, router]);

  if (isInitializing && pathname !== '/login') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" description="Initializing session..." />
      </div>
    );
  }

  return <>{children}</>;
}
