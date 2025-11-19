import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Button,
  Spin,
  message,
  Card,
  Space,
  QRCode,
} from 'antd';
import {
  ArrowLeftOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { getNovelDetail } from '../api';
import { setSEO } from '../utils/seo';
import type { NovelDetailResponse } from '../types';
import './BookDetail.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

type Theme = 'light' | 'dark';

function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookDetail, setBookDetail] = useState<NovelDetailResponse | null>(null);
  
  // 阅读模式：'light' 白天模式, 'dark' 黑夜模式
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('reading-theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
  });


  useEffect(() => {
    // 应用主题
    document.body.setAttribute('data-reading-theme', theme);
    localStorage.setItem('reading-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchBookDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const result = await getNovelDetail(id);
      
      if (result.code === 0 && result.data) {
        setBookDetail(result.data);
        // 设置SEO信息
        const book = result.data.book;
        setSEO({
          title: book.title,
          description: book.description || book.summary || `${book.title} - 朝戈读书在线阅读`,
          image: book.cover,
          url: window.location.href,
        });
      } else {
        message.error('获取书籍详情失败：' + (result.msg || '未知错误'));
        setTimeout(() => {
          navigate('/library');
        }, 2000);
      }
    } catch (error) {
      console.error('获取书籍详情失败:', error);
      message.error('网络错误，请检查后端服务是否启动');
      setTimeout(() => {
        navigate('/library');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 页面加载时滚动到顶部
    window.scrollTo(0, 0);
    fetchBookDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <Content className="book-detail-content" style={{ marginTop: 64 }}>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large">
            <div style={{ width: '100%', height: '200px' }} />
          </Spin>
          <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
            加载中...
          </Text>
        </div>
      </Content>
    );
  }

  if (!bookDetail) {
    return null;
  }

  const book = bookDetail.book;
  const promotion = bookDetail.promotion;
  const hasShareLink = promotion?.share_link && promotion.share_link.trim() !== '';

  return (
    <Content className="book-detail-content" style={{ marginTop: 64 }}>
      <div className="book-detail-container">
        {/* 返回按钮和主题切换 */}
        <div className="book-detail-header">
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="back-button"
            >
              返回
            </Button>
            <Button
              icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
              onClick={toggleTheme}
              className="theme-toggle-button"
              title={theme === 'light' ? '切换到黑夜模式' : '切换到白天模式'}
            >
              {theme === 'light' ? '黑夜' : '白天'}
            </Button>
          </Space>
        </div>

        {/* 阅读区域 */}
        <Card className={`book-content-card ${theme === 'dark' ? 'dark-mode' : ''}`}>
          <div className="book-content-wrapper">
            {/* 标题 */}
            <Title level={1} className="book-title">
              {book.title}
            </Title>

            {/* 内容 */}
            {book.content ? (
              <div className="book-content-wrapper-relative">
                <div className="book-content">
                  {book.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <Paragraph key={index} className="content-paragraph">
                        {paragraph}
                      </Paragraph>
                    )
                  ))}
                </div>
                
                {/* 渐变遮罩层和操作按钮 */}
                <div className={`content-overlay ${theme === 'dark' ? 'dark-overlay' : ''}`}>
                  <div className="overlay-gradient" />
                  <div className="overlay-content">
                    <Space direction="vertical" size="large" align="center">
                      {hasShareLink ? (
                        <>
                          <QRCode
                            value={promotion.share_link!}
                            size={160}
                            errorLevel="M"
                            style={{ background: 'white', padding: '8px' }}
                          />
                          <Text 
                            style={{ 
                              color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
                              fontSize: '14px',
                              fontWeight: 500,
                              textAlign: 'center'
                            }}
                          >
                            使用抖音App扫码阅读全文
                          </Text>
                        </>
                      ) : (
                        <Text 
                          style={{ 
                            color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
                            fontSize: '16px',
                            fontWeight: 500,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            maxWidth: '300px'
                          }}
                        >
                          打开抖音App搜索"意近故事会"，阅读全文
                        </Text>
                      )}
                    </Space>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-content">
                <Text type="secondary" style={{ fontSize: 16 }}>
                  暂无内容
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Content>
  );
}

export default BookDetail;

