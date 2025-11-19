import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  Divider,
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Avatar,
  Space,
  Button,
  Spin,
  message,
} from 'antd';
import {
  FireOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { getCategoryList, getNovelList, getHotNovelList } from '../api';
import { setSEO } from '../utils/seo';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

// 格式化字数显示
const formatWordCount = (count) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万字`;
  }
  return `${(count / 1000).toFixed(1)}千字`;
};

// 自定义轮播箭头组件
const CustomArrow = ({ className, style, onClick, direction }) => {
  return (
    <button
      className={className}
      style={{
        ...style,
        width: '40px',
        height: '40px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
      }}
    >
      {direction === 'prev' ? (
        <LeftOutlined style={{ color: 'white', fontSize: '20px' }} />
      ) : (
        <RightOutlined style={{ color: 'white', fontSize: '20px' }} />
      )}
    </button>
  );
};

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // 设置SEO信息
    setSEO({
      title: '首页',
      description: '朝戈读书 - 每一个短篇，都是一段完整的旅程。用碎片时间，品味完整故事。',
    });
  }, []);
  const [hotNovels, setHotNovels] = useState([]);
  const [latestNovels, setLatestNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novelsLoading, setNovelsLoading] = useState(true);

  // 分类颜色映射
  const categoryColors = [
    'pink', 'purple', 'blue', 'red', 'cyan', 
    'gold', 'magenta', 'volcano', 'orange', 'green',
    'geekblue', 'lime'
  ];

  useEffect(() => {
    fetchCategories();
    fetchNovels();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await getCategoryList();
      
      if (result.code === 0 && result.data) {
        const categoriesWithColor = result.data.map((cat, index) => ({
          id: cat.id,
          name: cat.name,
          color: categoryColors[index % categoryColors.length],
          level: cat.level,
          parent_id: cat.parent_id
        }));
        setCategories(categoriesWithColor);
      } else {
        message.error('获取分类失败：' + result.msg);
      }
    } catch (error) {
      console.error('获取分类失败:', error);
      message.error('网络错误，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  const fetchNovels = async () => {
    try {
      setNovelsLoading(true);
      const hotResult = await getHotNovelList();
      const latestResult = await getNovelList({ page: 1, page_size: 10 });
      
      if (hotResult.code === 0 && hotResult.data) {
        const hotList = Array.isArray(hotResult.data) ? hotResult.data : (hotResult.data.list || []);
        setHotNovels(hotList);
      }
      
      if (latestResult.code === 0 && latestResult.data) {
        setLatestNovels(latestResult.data.list || []);
      }
    } catch (error) {
      console.error('获取小说列表失败:', error);
      message.error('获取小说列表失败');
    } finally {
      setNovelsLoading(false);
    }
  };

  return (
    <>
      {/* 轮播Banner - 热门推荐 */}
      <Carousel 
        autoplay 
        dots={true}
        arrows={true}
        prevArrow={<CustomArrow direction="prev" />}
        nextArrow={<CustomArrow direction="next" />}
        className="banner-carousel"
      >
        {novelsLoading ? (
          <div>
            <div className="banner-slide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large">
                <div style={{ width: '100%', height: '360px' }} />
              </Spin>
            </div>
          </div>
        ) : hotNovels.length > 0 ? (
          hotNovels.map((novel) => (
            <div key={novel.id}>
              <div className="banner-slide banner-novel-slide">
                <div className="banner-novel-content">
                  <Row gutter={[24, 0]} align="middle" style={{ height: '100%' }}>
                    <Col xs={24} sm={24} md={10} lg={9}>
                      <div className="banner-cover-wrapper">
                        <div 
                          className="banner-cover"
                          style={{ 
                            width: '100%',
                            aspectRatio: '3/4',
                            maxWidth: '200px',
                            margin: '0 auto',
                            background: `url(${novel.cover})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 12,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          role="img"
                          aria-label={`${novel.title} 封面`}
                        >
                          <div className="banner-cover-overlay" />
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={15}>
                      <div className="banner-novel-info">
                        <Tag color="red" className="banner-hot-tag">
                          <FireOutlined /> 热门推荐
                        </Tag>
                        <Title level={2} className="banner-title">
                          {novel.title}
                        </Title>
                        <Paragraph 
                          ellipsis={{ rows: 3 }} 
                          className="banner-summary"
                        >
                          {novel.summary || '暂无简介'}
                        </Paragraph>
                        <div className="banner-meta">
                          <Space size="middle" wrap align="center">
                            <Space size={6}>
                              <Avatar size="small" icon={<UserOutlined />} />
                              <Text className="banner-meta-text">{novel.author}</Text>
                            </Space>
                            <Text className="banner-meta-text">
                              {formatWordCount(novel.word_count)}
                            </Text>
                            <Button 
                              type="primary" 
                              size="middle"
                              className="banner-read-btn"
                              onClick={() => {
                                navigate(`/book/${novel.id}`);
                              }}
                            >
                              开始阅读
                            </Button>
                          </Space>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <div className="banner-slide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: 18 }}>暂无热门推荐</Text>
            </div>
          </div>
        )}
      </Carousel>

      {/* 分类标签 */}
      <div className="category-section">
        <Title level={3}>
          <FireOutlined /> 热门分类
        </Title>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large">
              <div style={{ width: '100%', height: '100px' }} />
            </Spin>
          </div>
        ) : categories.length > 0 ? (
          <Space size={[8, 16]} wrap>
            {categories.map((cat) => (
              <Tag 
                key={cat.id} 
                color={cat.color} 
                style={{ fontSize: 16, padding: '8px 16px', cursor: 'pointer' }}
              >
                {cat.name}
              </Tag>
            ))}
          </Space>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无分类数据
          </div>
        )}
      </div>

      <Divider />

      {/* 最新更新 */}
      <div className="novels-section">
        <Title level={3}>
          <ClockCircleOutlined /> 最新更新
        </Title>
        {novelsLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large">
              <div style={{ width: '100%', height: '200px' }} />
            </Spin>
          </div>
        ) : latestNovels.length > 0 ? (
          <Row gutter={[16, 16]}>
            {latestNovels.map((novel) => (
              <Col xs={24} sm={12} key={novel.id}>
                <Card 
                  hoverable 
                  className="list-card"
                  onClick={() => navigate(`/book/${novel.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <Row gutter={16}>
                    <Col span={6}>
                      <div 
                        style={{ 
                          width: '100%',
                          aspectRatio: '3/4',
                          background: `url(${novel.cover})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: 8
                        }}
                        role="img"
                        aria-label={`${novel.title} 封面`}
                      />
                    </Col>
                    <Col span={18}>
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Title level={4} style={{ margin: 0 }}>{novel.title}</Title>
                        <Space>
                          <Text type="secondary">{formatWordCount(novel.word_count)}</Text>
                        </Space>
                        <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                          {novel.summary || '暂无简介'}
                        </Paragraph>
                        <Space split={<Divider type="vertical" />}>
                          <Text type="secondary">
                            <UserOutlined /> {novel.author}
                          </Text>
                        </Space>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            暂无更新
          </div>
        )}
      </div>
    </>
  );
}

export default Home;

