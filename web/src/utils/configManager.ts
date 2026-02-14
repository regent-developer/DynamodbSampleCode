// 配置管理工具
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-07

import { AppConfig } from '../types/config';

// 配置存储键
const CONFIG_KEY = 'dynamodb-admin-config';

// 默认配置
const DEFAULT_CONFIG: AppConfig = {
  dynamodb: {
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  },
  theme: 'light'
};

/**
 * 加载配置
 * @returns 应用配置
 */
export const loadConfig = (): AppConfig => {
  try {
    const storedConfig = localStorage.getItem(CONFIG_KEY);
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      return parsedConfig;
    }
    
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Failed to load config:', error);
    return DEFAULT_CONFIG;
  }
};

/**
 * 保存配置
 * @param config 应用配置
 */
export const saveConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config:', error);
  }
};

/**
 * 获取默认配置
 * @returns 默认配置
 */
export const getDefaultConfig = (): AppConfig => {
  return { ...DEFAULT_CONFIG };
};