/**
 * API 接口配置
 */

import type { 
  ApiResponse, 
  Category, 
  Novel, 
  NovelDetail, 
  NovelListResponse,
  GetNovelListParams,
  GetCategoryListParams
} from '../types';

// API 基础地址
// 开发环境使用本地地址，生产环境使用线上地址
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api-manager.cffytech.com'
  : 'http://127.0.0.1:8090';

/**
 * 获取分类列表
 * @param params - 查询参数
 */
export const getCategoryList = async (params: GetCategoryListParams = {}): Promise<ApiResponse<Category[]>> => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const url = queryString 
      ? `${API_BASE_URL}/v1/category/list?${queryString}`
      : `${API_BASE_URL}/v1/category/list`;
    const response = await fetch(url);
    const result = await response.json() as ApiResponse<Category[]>;
    return result;
  } catch (error) {
    console.error('获取分类列表失败:', error);
    throw error;
  }
};

/**
 * 获取小说列表
 * @param params - 查询参数
 */
export const getNovelList = async (params: GetNovelListParams = { page: 1, page_size: 10 }): Promise<ApiResponse<NovelListResponse>> => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const response = await fetch(`${API_BASE_URL}/v1/book/list?${queryString}`);
    const result = await response.json() as ApiResponse<NovelListResponse>;
    return result;
  } catch (error) {
    console.error('获取小说列表失败:', error);
    throw error;
  }
};

/**
 * 获取热门书籍列表
 */
export const getHotNovelList = async (): Promise<ApiResponse<Novel[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/book/hot/list`);
    const result = await response.json() as ApiResponse<Novel[]>;
    return result;
  } catch (error) {
    console.error('获取热门书籍列表失败:', error);
    throw error;
  }
};

/**
 * 获取小说详情
 * @param id - 小说ID
 */
export const getNovelDetail = async (id: number | string): Promise<ApiResponse<NovelDetail>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/book/${id}`);
    const result = await response.json() as ApiResponse<NovelDetail>;
    return result;
  } catch (error) {
    console.error('获取小说详情失败:', error);
    throw error;
  }
};

/**
 * 搜索小说（待实现）
 * @param keyword - 搜索关键词
 */
export const searchNovels = async (keyword: string): Promise<void> => {
  // TODO: 实现搜索接口
  console.log('搜索小说:', keyword);
};

