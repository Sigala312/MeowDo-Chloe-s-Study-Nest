'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. 定義 Header 資料的型別
export interface HeaderInfo {
  title: string;
  subtitle?: string;
}

// 2. 定義 Context 的型別，包含 setHeader
export interface PageHeaderContextType {
  title: string;
  subtitle: string;
  setHeader: (info: HeaderInfo) => void;
  setTitle: (title: string) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export const PageHeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitleState] = useState('');
  const [subtitle, setSubtitle] = useState('');

  // 同時設定 title 與 subtitle 的 helper
  const setHeader = ({ title, subtitle = '' }: HeaderInfo) => {
    setTitleState(title);
    setSubtitle(subtitle);
  };

  const setTitle = (newTitle: string) => {
    setTitleState(newTitle);
  };

  return (
    <PageHeaderContext.Provider value={{ title, subtitle, setHeader, setTitle }}>
      {children}
    </PageHeaderContext.Provider>
  );
};

// 3. 自訂 Hook 方便在元件中使用
export const usePageHeader = () => {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }
  return context;
};