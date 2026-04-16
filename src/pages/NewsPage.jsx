import React, { useState } from "react";
import { Row, Col, Card, Tag, Typography, Tabs, Button, Input, Space, Avatar, Empty } from "antd";
import { 
  SearchOutlined, 
  ClockCircleOutlined, 
  FireFilled, 
  ArrowRightOutlined,
  CustomerServiceOutlined 
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const SoundNews = () => {
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { key: "all", label: "Tất cả" },
    { key: "review", label: "Đánh giá loa" },
    { key: "setup", label: "Góc Setup" },
    { key: "tech", label: "Công nghệ âm thanh" },
    { key: "brands", label: "Câu chuyện thương hiệu" },
  ];

  const newsData = [
    {
      id: 1,
      title: "Đánh giá chi tiết Marshall Woburn III: Đỉnh cao âm thanh Retro",
      category: "review",
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop",
      date: "05/03/2026",
      desc: "Woburn III sở hữu âm trường rộng hơn so với người tiền nhiệm, mang lại trải nghiệm âm thanh đắm chìm...",
      hot: true,
      author: "Vinh Audiophile"
    },
    {
      id: 2,
      title: "5 Bước setup dàn loa nghe nhạc chuẩn như phòng thu tại gia",
      category: "setup",
      image: "https://images.unsplash.com/photo-1594106182463-b5d347466613?q=80&w=2070&auto=format&fit=crop",
      date: "04/03/2026",
      desc: "Vị trí đặt loa quyết định 50% chất lượng âm thanh. Hãy cùng SoundHub tìm hiểu cách tối ưu không gian của bạn.",
      hot: false,
      author: "SoundHub Team"
    },
    {
      id: 3,
      title: "Công nghệ LE Audio mới trên loa JBL có gì đặc biệt?",
      category: "tech",
      image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=2070&auto=format&fit=crop",
      date: "02/03/2026",
      desc: "Bluetooth LE Audio hứa hẹn thay đổi cách chúng ta trải nghiệm âm thanh không dây với độ trễ cực thấp.",
      hot: false,
      author: "Admin"
    }
  ];

  return (
    <div className="news-page-container">
      <div className="news-content-wrapper">
        
        {/* Header Section */}
        <div className="news-header-section mb-4">
          <Row gutter={[20, 20]} align="bottom">
            <Col xs={24} lg={16}>
              <div className="brand-label">MAGAZINE</div>
              <Title level={1} className="main-news-title">Tạp chí âm thanh</Title>
            </Col>
            <Col xs={24} lg={8}>
              <Input 
                prefix={<SearchOutlined style={{ color: "#666" }} />} 
                placeholder="Tìm bài viết..." 
                className="search-input-dark"
              />
            </Col>
          </Row>
        </div>

        {/* Categories Tabs - Tối ưu vuốt ngang trên mobile */}
        <div className="tabs-container mb-4">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="soundhub-tabs"
            items={categories.map(c => ({
              key: c.key,
              label: c.label
            }))}
          />
        </div>

        {/* News Content Area */}
        <div className="news-list-area">
          <AnimatePresence mode="wait">
            {(() => {
              const filteredData = newsData.filter(
                (n) => activeTab === "all" || n.category === activeTab
              );

              if (filteredData.length > 0) {
                return (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Row gutter={[24, 24]}>
                      {filteredData.map((news) => (
                        <Col xs={24} sm={12} lg={8} key={news.id}>
                          <Card
                            bordered={false}
                            className="news-card-dark"
                            cover={
                              <div className="image-wrapper">
                                <img src={news.image} alt={news.title} loading="lazy" />
                                {news.hot && <span className="hot-badge"><FireFilled /> HOT</span>}
                              </div>
                            }
                          >
                            <div className="card-inner-body">
                              <Tag className="category-tag">
                                {categories.find(c => c.key === news.category)?.label.toUpperCase()}
                              </Tag>
                              <Title level={4} className="news-card-title mt-2">
                                {news.title}
                              </Title>
                              <Paragraph className="news-desc" ellipsis={{ rows: 2 }}>
                                {news.desc}
                              </Paragraph>
                              
                              <div className="meta-footer mt-auto pt-3">
                                <div className="author-info">
                                  <Avatar size={24} icon={<CustomerServiceOutlined />} className="author-avatar" />
                                  <Text className="author-name">{news.author}</Text>
                                </div>
                                <Text className="date-text">
                                  <ClockCircleOutlined /> {news.date}
                                </Text>
                              </div>
                              
                              <Button type="link" className="p-0 read-more-btn mt-3">
                                ĐỌC TIẾP <ArrowRightOutlined />
                              </Button>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state-container"
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div className="empty-text">
                        <Title level={4} className="empty-title">Chưa có bài viết nào</Title>
                        <Text className="empty-desc">Nội dung đang được biên tập.</Text>
                      </div>
                    }
                  >
                    <Button className="btn-back-all" onClick={() => setActiveTab('all')}>
                      XEM TẤT CẢ
                    </Button>
                  </Empty>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .news-page-container {
          background-color: #0f0f0f;
          color: #fff;
          padding: 80px 0 40px;
          min-height: 100vh;
        }

        .news-content-wrapper {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .brand-label {
          color: #ff6600;
          font-weight: 600;
          letter-spacing: 2px;
          font-size: 12px;
        }

        .main-news-title {
          color: #fff !important;
          margin: 0 !important;
          font-size: clamp(2rem, 5vw, 3.5rem) !important;
          font-weight: 800 !important;
        }

        .search-input-dark {
          background: #1a1a1a !important;
          border: 1px solid #333 !important;
          height: 48px;
          border-radius: 8px;
        }
        .search-input-dark input { color: #fff !important; }

        /* Tabs Mobile */
        .soundhub-tabs .ant-tabs-nav::before { border-bottom: 1px solid #222 !important; }
        .soundhub-tabs .ant-tabs-tab { color: #888 !important; font-size: 15px; }
        .soundhub-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #ff6600 !important; font-weight: 700; }
        .soundhub-tabs .ant-tabs-ink-bar { background: #ff6600 !important; }

        /* News Card */
        .news-card-dark {
          background: #151515 !important;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .news-card-dark:hover {
          transform: translateY(-6px);
          background: #1d1d1d !important;
        }

        .image-wrapper { 
          position: relative; 
          aspect-ratio: 16/10; 
          overflow: hidden; 
        }
        .image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .news-card-dark:hover .image-wrapper img { transform: scale(1.08); }

        .card-inner-body { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
        
        .category-tag {
          background: #ff6600 !important;
          color: #fff !important;
          border: none;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          width: fit-content;
        }

        .news-card-title {
          color: #fff !important;
          margin: 0 !important;
          font-size: 18px !important;
          line-height: 1.4 !important;
          transition: 0.3s;
        }
        .news-card-dark:hover .news-card-title { color: #ff6600 !important; }

        .news-desc { color: #aaa !important; margin: 12px 0 !important; }

        .meta-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #222;
        }

        .author-info { display: flex; align-items: center; gap: 8px; }
        .author-avatar { background: #333; }
        .author-name, .date-text { color: #666 !important; font-size: 12px !important; }

        .read-more-btn { color: #ff6600 !important; font-size: 11px !important; font-weight: 800 !important; letter-spacing: 1px; }

        /* Empty State */
        .empty-state-container { padding: 100px 0; text-align: center; }
        .empty-title { color: #888 !important; margin-bottom: 8px !important; }
        .empty-desc { color: #555 !important; }
        .btn-back-all {
          background: #ff6600 !important;
          border: none !important;
          color: #fff !important;
          height: 40px;
          padding: 0 30px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .news-page-container { padding: 60px 0 30px; }
          .main-news-title { margin-bottom: 15px !important; }
          .card-inner-body { padding: 15px; }
          .news-card-title { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default SoundNews;