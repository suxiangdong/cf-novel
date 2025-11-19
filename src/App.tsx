import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Input,
  Typography, 
  Space,
  ConfigProvider,
  theme,
} from 'antd';
import {
  BookOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Search } = Input;
import './App.css';
import Home from './pages/Home';
import Library from './pages/Library';
import Ranking from './pages/Ranking';
import BookDetail from './pages/BookDetail';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// 路由切换时滚动到顶部
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 导航组件
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  
  const getSelectedKey = (): string[] => {
    if (location.pathname === '/library') {
      return ['library'];
    } else if (location.pathname === '/ranking') {
      return ['ranking'];
    }
    return ['home'];
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'library') {
      navigate('/library');
    } else if (key === 'ranking') {
      navigate('/ranking');
    } else {
      navigate('/');
    }
  };

  const handleSearch = (value: string) => {
    if (value && value.trim()) {
      navigate(`/library?title=${encodeURIComponent(value.trim())}`);
      setSearchValue('');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ScrollToTop />
      {/* 顶部导航 */}
      <Header className="header">
        <div className="header-content">
          <div className="logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <BookOutlined style={{ fontSize: 24, marginRight: 8 }} />
            <Title level={3} style={{ margin: 0, color: 'white' }}>朝戈读书</Title>
          </div>
          
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={getSelectedKey()}
            className="main-menu"
            items={[
              { key: 'home', label: '首页' },
              { key: 'library', label: '书库' },
              { key: 'ranking', label: '排行榜' },
            ]}
            onClick={handleMenuClick}
          />
          
          <div className="search-box">
            <Search
              placeholder="搜索小说、作者"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
              allowClear
              enterButton
            />
          </div>
        </div>
      </Header>

      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/book/:id" element={<BookDetail />} />
        </Routes>
      </Content>

      {/* 底部 */}
      <Footer style={{ textAlign: 'center', background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', marginTop: 60 }}>
        <Space direction="vertical" size={16}>
          <Space size="large" className="footer-links">
            <a href="/about" style={{ color: 'white' }}>关于我们</a>
            <a href="/contact" style={{ color: 'white' }}>联系方式</a>
            <a href="/submit" style={{ color: 'white' }}>投稿须知</a>
            <a href="/terms" style={{ color: 'white' }}>用户协议</a>
            <a href="/privacy" style={{ color: 'white' }}>隐私政策</a>
          </Space>
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
            朝戈读书 ©2024 - 每一个短篇，都是一段完整的旅程
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
            <a 
              href="https://beian.miit.gov.cn/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}
            >
              京ICP备2025145975号-1
            </a>
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
}

function App() {

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#667eea',
        },
      }}
    >
      <Router>
        <AppLayout />
      </Router>
    </ConfigProvider>
  );
}

export default App;

