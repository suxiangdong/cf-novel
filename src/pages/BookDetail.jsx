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
} from 'antd';
import {
  ArrowLeftOutlined,
  SunOutlined,
  MoonOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { getNovelDetail } from '../api';
import { setSEO } from '../utils/seo';
import './BookDetail.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  
  // 阅读模式：'light' 白天模式, 'dark' 黑夜模式
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('reading-theme');
    return savedTheme || 'light';
  });


  useEffect(() => {
    // 应用主题
    document.body.setAttribute('data-reading-theme', theme);
    localStorage.setItem('reading-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };


  // 复制抖音链接
  const copyDouyinLink = () => {
    const currentUrl = window.location.href;
    // 这里可以根据实际需求构造抖音链接格式
    // 假设是复制当前页面链接
    navigator.clipboard.writeText(currentUrl).then(() => {
      message.success('链接已复制到剪贴板');
    }).catch(() => {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success('链接已复制到剪贴板');
      } catch (err) {
        message.error('复制失败，请手动复制');
      }
      document.body.removeChild(textArea);
    });
  };

  // 获取当前页面URL
  const getCurrentUrl = () => {
    return window.location.href;
  };

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const result = await getNovelDetail(id);
      
      if (result.code === 0 && result.data) {
        setBook(result.data);
        // 设置SEO信息
        setSEO({
          title: result.data.title,
          description: result.data.description || result.data.summary || `${result.data.title} - 朝戈读书在线阅读`,
          image: result.data.cover,
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

  if (!book) {
    return null;
  }

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
                    <Button
                      type="primary"
                      icon={<CopyOutlined />}
                      onClick={copyDouyinLink}
                      className="overlay-copy-button"
                      size="large"
                    >
                      复制链接并在抖音App内打开
                    </Button>
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

