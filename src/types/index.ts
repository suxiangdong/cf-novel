/**
 * API 响应类型定义
 */

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg: string;
}

/**
 * 分类类型
 */
export interface Category {
  id: number;
  parent_id: number;
  name: string;
  level: number;
  created_at: string;
  updated_at: string;
}

/**
 * 小说类型
 */
export interface Novel {
  id: number;
  title: string;
  summary: string;
  cover: string;
  word_count: number;
  author: string;
  added_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * 小说详情类型
 */
export interface NovelDetail extends Novel {
  content?: string;
  description?: string;
  category_id?: number;
  category_name?: string;
  views?: number;
  likes?: number;
}

/**
 * 分页信息
 */
export interface Paginate {
  page: number;
  page_size: number;
  total: number;
}

/**
 * 小说列表响应
 */
export interface NovelListResponse {
  list: Novel[];
  paginate: Paginate;
}

/**
 * API 请求参数
 */
export interface GetNovelListParams {
  page?: number;
  page_size?: number;
  category_first_id?: number;
  category_second_id?: number;
  title?: string;
}

export interface GetCategoryListParams {
  parent_id?: number;
}

/**
 * SEO 数据
 */
export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

/**
 * 带颜色的分类类型
 */
export interface CategoryWithColor extends Category {
  color: string;
}

