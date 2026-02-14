// React 应用入口文件
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);