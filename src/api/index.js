/**
 * API 接口配置
 */

// API 基础地址
// 开发环境使用本地地址，生产环境使用线上地址
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api-manager.cffytech.com'
  : 'http://127.0.0.1:8090';

/**
 * 获取分类列表
 * @param {Object} params - 查询参数
 * @param {number} params.parent_id - 父分类ID（可选，用于获取二级分类）
 */
export const getCategoryList = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${API_BASE_URL}/v1/category/list?${queryString}`
      : `${API_BASE_URL}/v1/category/list`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('获取分类列表失败:', error);
    throw error;
  }
};

/**
 * 获取小说列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页数量
 * @param {number} params.category_first_id - 一级分类ID（可选）
 * @param {number} params.category_second_id - 二级分类ID（可选）
 * @param {string} params.title - 搜索关键词（可选）
 */
export const getNovelList = async (params = { page: 1, page_size: 10 }) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/v1/book/list?${queryString}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('获取小说列表失败:', error);
    throw error;
  }
};

/**
 * 获取热门书籍列表
 */
export const getHotNovelList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/book/hot/list`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('获取热门书籍列表失败:', error);
    throw error;
  }
};

/**
 * 获取小说详情
 * @param {number} id - 小说ID
 */
export const getNovelDetail = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/book/${id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('获取小说详情失败:', error);
    throw error;
  }
};

/**
 * 搜索小说（待实现）
 * @param {string} keyword - 搜索关键词
 */
export const searchNovels = async (keyword) => {
  // TODO: 实现搜索接口
  console.log('搜索小说:', keyword);
};

