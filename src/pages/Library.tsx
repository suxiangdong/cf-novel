import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Avatar,
  Pagination,
  Spin,
  message,
  Empty,
  Divider,
  Input,
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { getNovelList, getCategoryList } from '../api';
import { setSEO } from '../utils/seo';
import type { Novel, CategoryWithColor } from '../types';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;

// 格式化字数显示
const formatWordCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万字`;
  }
  return `${(count / 1000).toFixed(1)}千字`;
};

// 分类颜色映射
const categoryColors = [
  'pink', 'purple', 'blue', 'red', 'cyan', 
  'gold', 'magenta', 'volcano', 'orange', 'green',
  'geekblue', 'lime'
];

function Library() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryWithColor[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryWithColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const searchTitle = searchParams.get('title') || '';
  const categoryFirstId = searchParams.get('category_first_id');
  const categorySecondId = searchParams.get('category_second_id');
  const [searchValue, setSearchValue] = useState(searchTitle);
  // 根据响应式布局计算：xs=2本/行, sm=3本/行, md=4本/行, lg=6本/行, xl=8本/行
  // 设置为24本/页，这样在不同屏幕下都能显示2-4行，体验较好
  const pageSize = 24;

  // 从URL参数初始化分类选择（在分类数据加载完成后）
  useEffect(() => {
    if (allCategories.length > 0) {
      if (categoryFirstId) {
        const firstId = parseInt(categoryFirstId, 10);
        if (!isNaN(firstId)) {
          // 验证分类是否存在
          const categoryExists = allCategories.some(cat => cat.id === firstId);
          if (categoryExists) {
            setSelectedParentCategory(firstId);
          }
        }
      }
      if (categorySecondId) {
        const secondId = parseInt(categorySecondId, 10);
        if (!isNaN(secondId)) {
          // 验证分类是否存在
          const categoryExists = allCategories.some(cat => cat.id === secondId);
          if (categoryExists) {
            setSelectedCategory(secondId);
          }
        }
      }
    }
  }, [categoryFirstId, categorySecondId, allCategories]);

  useEffect(() => {
    fetchCategories();
    // 设置SEO信息
    setSEO({
      title: searchTitle ? `搜索：${searchTitle}` : '书库',
      description: searchTitle ? `搜索"${searchTitle}"相关的小说` : '浏览朝戈读书的所有小说，发现您喜欢的短篇故事',
    });
  }, [searchTitle]);

  useEffect(() => {
    fetchNovels();
  }, [currentPage, selectedCategory, selectedParentCategory, searchTitle]);

  // 同步URL参数到搜索框
  useEffect(() => {
    setSearchValue(searchTitle);
  }, [searchTitle]);

  useEffect(() => {
    // 当选中一级分类时，获取二级分类
    if (selectedParentCategory) {
      fetchSubCategories(selectedParentCategory);
    } else {
      setSubCategories([]);
    }
  }, [selectedParentCategory]);

  const fetchCategories = async () => {
    try {
      const result = await getCategoryList();
      if (result.code === 0 && result.data) {
        const categoriesWithColor: CategoryWithColor[] = result.data.map((cat, index) => ({
          ...cat,
          color: categoryColors[index % categoryColors.length],
        }));
        setAllCategories(categoriesWithColor);
        // 分离一级和二级分类
        const parentCats = categoriesWithColor.filter(cat => cat.level === 1 || !cat.parent_id);
        setSubCategories(categoriesWithColor.filter(cat => cat.level === 2 || cat.parent_id));
      }
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  const fetchSubCategories = async (parentId: number) => {
    try {
      // 请求API获取二级分类，传入parent_id参数
      const result = await getCategoryList({ parent_id: parentId });
      if (result.code === 0 && result.data) {
        const subCats: CategoryWithColor[] = result.data.map((cat, index) => ({
          ...cat,
          color: categoryColors[index % categoryColors.length],
        }));
        setSubCategories(subCats);
      }
    } catch (error) {
      console.error('获取二级分类失败:', error);
    }
  };

  const fetchNovels = async () => {
    try {
      setLoading(true);
      const params: {
        page: number;
        page_size: number;
        title?: string;
        category_first_id?: number;
        category_second_id?: number;
      } = {
        page: currentPage,
        page_size: pageSize,
      };
      // 如果有搜索关键词，传入title参数
      if (searchTitle) {
        params.title = searchTitle;
      }
      // 分类筛选（搜索时分类筛选仍然有效）
      if (selectedCategory) {
        // 如果选中的是子分类（二级分类），传入category_second_id和category_first_id
        params.category_second_id = selectedCategory;
        if (selectedParentCategory) {
          params.category_first_id = selectedParentCategory;
        }
      } else if (selectedParentCategory) {
        // 如果选中的是主分类（一级分类），传入category_first_id
        params.category_first_id = selectedParentCategory;
      }
      const result = await getNovelList(params);
      
      if (result.code === 0 && result.data) {
        setNovels(result.data.list || []);
        // 支持多种数据结构：result.data.total 或 result.data.paginate.total
        const totalCount = (result.data as any).total || result.data.paginate?.total || 0;
        setTotal(totalCount);
      } else {
        message.error('获取书籍列表失败：' + (result.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取书籍列表失败:', error);
      message.error('网络错误，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  const handleParentCategoryClick = (categoryId: number) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (selectedParentCategory === categoryId) {
      // 取消选择
      setSelectedParentCategory(null);
      setSelectedCategory(null);
      newParams.delete('category_first_id');
      newParams.delete('category_second_id');
    } else {
      // 选择一级分类
      setSelectedParentCategory(categoryId);
      setSelectedCategory(null); // 清除二级分类选择
      newParams.set('category_first_id', categoryId.toString());
      newParams.delete('category_second_id');
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleSubCategoryClick = (categoryId: number) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (selectedCategory === categoryId) {
      // 取消选择二级分类，但保留一级分类
      setSelectedCategory(null);
      newParams.delete('category_second_id');
    } else {
      // 选择二级分类
      setSelectedCategory(categoryId);
      newParams.set('category_second_id', categoryId.toString());
      // 确保一级分类ID也在URL中
      if (selectedParentCategory) {
        newParams.set('category_first_id', selectedParentCategory.toString());
      }
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    const trimmedValue = value?.trim() || '';
    const newParams = new URLSearchParams(searchParams);
    
    if (trimmedValue) {
      newParams.set('title', trimmedValue);
    } else {
      newParams.delete('title');
    }
    
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  // 处理搜索框输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 处理搜索框清除
  const handleSearchClear = () => {
    setSearchValue('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('title');
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  return (
    <Content className="library-content" style={{ minHeight: 'calc(100vh - 64px)', marginTop: 64 }}>
      <div className="library-container">
        {/* 页面标题 */}
        <Title level={2} style={{ marginBottom: 24 }}>
          <BookOutlined /> 书库
        </Title>

        {/* 搜索栏 */}
        <div style={{ marginBottom: 24 }}>
          <Search
            placeholder="搜索小说、作者"
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onClear={handleSearchClear}
            allowClear
            size="large"
            enterButton
            className="library-search-input"
          />
        </div>

        {/* 分类筛选 */}
        <div className="category-filter-section">
          {/* 主分类 */}
          <div className="category-group">
            <div className="category-group-header">
              <Text strong className="category-group-title">主分类</Text>
            </div>
            <div className="category-group-content">
              <div
                className={`category-item category-item-all ${selectedParentCategory === null ? 'active' : ''}`}
                onClick={() => {
                  setSelectedParentCategory(null);
                  setSelectedCategory(null);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('category_first_id');
                  newParams.delete('category_second_id');
                  setSearchParams(newParams);
                  setCurrentPage(1);
                }}
              >
                全部
              </div>
              {allCategories
                .filter(cat => cat.level === 1 || !cat.parent_id)
                .map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-item ${selectedParentCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleParentCategoryClick(cat.id)}
                  >
                    {cat.name}
                  </div>
                ))}
            </div>
          </div>
          
          {/* 子分类（仅当选中主分类时显示） */}
          {selectedParentCategory && subCategories.length > 0 && (
            <div className="category-group sub-category-group">
              <div className="category-group-header">
                <Text strong className="category-group-title">子分类</Text>
              </div>
              <div className="category-group-content">
                <div
                  className={`category-item category-item-all sub-category-item ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(null);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('category_second_id');
                    setSearchParams(newParams);
                    setCurrentPage(1);
                  }}
                >
                  全部
                </div>
                {subCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-item sub-category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleSubCategoryClick(cat.id)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* 书籍列表 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large">
              <div style={{ width: '100%', height: '200px' }} />
            </Spin>
          </div>
        ) : novels.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {novels.map((novel) => (
                <Col xs={12} sm={8} md={6} lg={4} xl={3} key={novel.id}>
                  <Card
                    hoverable
                    cover={
                      <div 
                        style={{ 
                          width: '100%',
                          aspectRatio: '3/4',
                          background: `url(${novel.cover})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        role="img"
                        aria-label={`${novel.title} 封面`}
                      />
                    }
                    className="novel-card"
                    bodyStyle={{ padding: '12px' }}
                    onClick={() => {
                      navigate(`/book/${novel.id}`);
                    }}
                  >
                    <Meta
                      title={
                        <Text strong ellipsis style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                          {novel.title}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Text type="secondary" ellipsis={{ rows: 1 }} style={{ fontSize: 12 }}>
                            {novel.summary || '暂无简介'}
                          </Text>
                          <Space size={4} style={{ fontSize: 11 }}>
                            <Avatar size={16} icon={<UserOutlined />} />
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {novel.author}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {formatWordCount(novel.word_count)}
                            </Text>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* 分页 */}
            <div style={{ textAlign: 'center', marginTop: 40, marginBottom: 40 }}>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total) => `共 ${total} 本`}
                onChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <Empty
            description="暂无书籍"
            style={{ padding: '60px 0' }}
          />
        )}
      </div>
    </Content>
  );
}

export default Library;

