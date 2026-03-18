'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme as antdTheme } from 'antd';
import MainLayout from '@/components/MainLayout';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { themeConfig } from '@/lib/theme';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AppWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;
  const currentConfig = theme === 'dark' ? themeConfig.dark : themeConfig.light;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: currentConfig.primary,
          borderRadius: 6,
          colorBgLayout: currentConfig.layoutBg,
          colorBgContainer: currentConfig.containerBg,
          colorBgElevated: theme === 'dark' ? currentConfig.elevatedBg : '#ffffff',
        },
      }}
    >
      <div data-theme={theme}>
        <MainLayout>
          {children}
        </MainLayout>
      </div>
    </ConfigProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AntdRegistry>
          <ThemeProvider>
            <AppWrapper>
              {children}
            </AppWrapper>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
