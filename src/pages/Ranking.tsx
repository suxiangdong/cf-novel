import React from 'react';
import { Layout, Typography, Space, Card, Button } from 'antd';
import {
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import './Ranking.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function Ranking() {
  return (
    <Content className="ranking-content" style={{ minHeight: 'calc(100vh - 64px)', marginTop: 64 }}>
      <div className="ranking-container">
        {/* 主要内容区域 */}
        <div className="coming-soon-content">
          {/* 图标区域 */}
          <div className="coming-soon-icon">
            <div className="icon-wrapper">
              <TrophyOutlined className="trophy-icon" />
            </div>
          </div>

          {/* 标题 */}
          <Title level={1} className="coming-soon-title">
            排行榜即将上线
          </Title>

          {/* 副标题 */}
          <Paragraph className="coming-soon-subtitle">
            我们正在精心准备各类排行榜，为您推荐最受欢迎的小说
          </Paragraph>

          {/* 功能预览卡片 */}
          <div className="feature-cards">
            <Card className="feature-card" hoverable>
              <div className="feature-icon">
                <FireOutlined />
              </div>
              <Title level={4} className="feature-title">热门榜单</Title>
              <Text type="secondary" className="feature-desc">
                实时更新的热门小说排行
              </Text>
            </Card>

            <Card className="feature-card" hoverable>
              <div className="feature-icon">
                <StarOutlined />
              </div>
              <Title level={4} className="feature-title">评分榜单</Title>
              <Text type="secondary" className="feature-desc">
                根据读者评分排序的优质作品
              </Text>
            </Card>

            <Card className="feature-card" hoverable>
              <div className="feature-icon">
                <ClockCircleOutlined />
              </div>
              <Title level={4} className="feature-title">更新榜单</Title>
              <Text type="secondary" className="feature-desc">
                最新更新的小说推荐
              </Text>
            </Card>

            <Card className="feature-card" hoverable>
              <div className="feature-icon">
                <BookOutlined />
              </div>
              <Title level={4} className="feature-title">分类榜单</Title>
              <Text type="secondary" className="feature-desc">
                各分类下的精选作品排行
              </Text>
            </Card>
          </div>

          {/* 提示信息 */}
          <div className="coming-soon-notice">
            <ClockCircleOutlined className="notice-icon" />
            <Text className="notice-text">
              敬请期待，我们很快与您见面！
            </Text>
          </div>

          {/* 返回按钮 */}
          <Space size="large" className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              onClick={() => window.history.back()}
              className="back-button"
            >
              返回上一页
            </Button>
            <Button 
              size="large"
              onClick={() => { window.location.href = '/library'; }}
              className="library-button"
            >
              浏览书库
            </Button>
          </Space>
        </div>
      </div>
    </Content>
  );
}

export default Ranking;

