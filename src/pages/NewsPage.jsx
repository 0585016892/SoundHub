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
    <div className="news-page-container" style={{ backgroundColor: "#0f0f0f", color: "#fff", padding: "120px 0 60px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        
        {/* Header Section */}
        <Row align="bottom" justify="space-between" className="mb-5">
          <Col>
            <Space direction="vertical" size={0}>
              <Text style={{ color: "#ff6600", fontWeight: 600, letterSpacing: 2 }}>MAGAZINE</Text>
              <Title level={1} style={{ color: "#fff", margin: 0, fontSize: "3rem" }}>Tạp chí âm thanh</Title>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Input 
              prefix={<SearchOutlined style={{ color: "#666" }} />} 
              placeholder="Tìm bài viết, thương hiệu..." 
              className="search-input-dark"
            />
          </Col>
        </Row>

        {/* Categories Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="soundhub-tabs"
          items={categories.map(c => ({
            key: c.key,
            label: c.label
          }))}
        />

        {/* News Content Area */}
        <div className="mt-4" style={{ minHeight: '450px' }}>
          <AnimatePresence mode="wait">
            {(() => {
              const filteredData = newsData.filter(
                (n) => activeTab === "all" || n.category === activeTab
              );

              if (filteredData.length > 0) {
                return (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Row gutter={[32, 32]}>
                      {filteredData.map((news, idx) => (
                        <Col xs={24} md={12} lg={8} key={news.id}>
                          <Card
                            bordered={false}
                            className="news-card-dark"
                            cover={
                              <div className="image-wrapper">
                                <img src={news.image} alt={news.title} />
                                {news.hot && <span className="hot-badge"><FireFilled /> HOT</span>}
                              </div>
                            }
                          >
                            <Space direction="vertical" size={12}>
                              <Tag color="#ff6600" style={{ borderRadius: 0, border: 'none', fontWeight: 600 }}>
                                {categories.find(c => c.key === news.category)?.label.toUpperCase()}
                              </Tag>
                              <Title level={4} style={{ color: "#fff", margin: 0 }} className="news-title">
                                {news.title}
                              </Title>
                              <Paragraph style={{ color: "#aaa" }} ellipsis={{ rows: 2 }}>
                                {news.desc}
                              </Paragraph>
                              <div className="d-flex justify-content-between align-items-center mt-2">
                                <Space>
                                  <Avatar size="small" icon={<CustomerServiceOutlined />} style={{ backgroundColor: '#333' }} />
                                  <Text style={{ color: "#666", fontSize: 12 }}>{news.author}</Text>
                                </Space>
                                <Text style={{ color: "#666", fontSize: 12 }}>
                                  <ClockCircleOutlined className="me-1" /> {news.date}
                                </Text>
                              </div>
                              <Button type="link" className="p-0 read-more-btn">
                                ĐỌC TIẾP <ArrowRightOutlined />
                              </Button>
                            </Space>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </motion.div>
                );
              }

              // Trạng thái Trống (Empty State)
              return (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="d-flex justify-content-center align-items-center"
                  style={{ paddingTop: '80px' }}
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div style={{ color: '#666' }}>
                        <Title level={4} style={{ color: '#888', marginBottom: 8 }}>
                          Chưa có bài viết nào
                        </Title>
                        <Text style={{ color: '#555' }}>
                          Nội dung cho chuyên mục này đang được SoundHub biên tập.
                        </Text>
                      </div>
                    }
                  >
                    <Button 
                      type="primary" 
                      style={{ backgroundColor: '#ff6600', borderColor: '#ff6600', borderRadius: '4px', height: '40px', padding: '0 25px' }}
                      onClick={() => setActiveTab('all')}
                    >
                      XEM CÁC BÀI VIẾT KHÁC
                    </Button>
                  </Empty>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        /* Tổng thể Dark Mode */
        .search-input-dark {
          background: #1a1a1a !important;
          border: 1px solid #333 !important;
          border-radius: 4px;
          height: 45px;
        }
        .search-input-dark input { background: transparent !important; color: #fff !important; }
        .search-input-dark:hover, .search-input-dark:focus { border-color: #ff6600 !important; }

        /* Tabs Custom */
        .soundhub-tabs .ant-tabs-tab { color: #888 !important; font-size: 16px; padding: 12px 0 !important; }
        .soundhub-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #ff6600 !important; font-weight: bold; }
        .soundhub-tabs .ant-tabs-ink-bar { background: #ff6600 !important; height: 3px !important; }
        .soundhub-tabs .ant-tabs-nav::before { border-bottom: 1px solid #222 !important; }

        /* Card Tin tức */
        .news-card-dark {
          background: #151515 !important;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
        }
        .news-card-dark:hover {
          transform: translateY(-8px);
          background: #1d1d1d !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6) !important;
        }

        .image-wrapper { position: relative; height: 220px; overflow: hidden; }
        .image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s cubic-bezier(0.33, 1, 0.68, 1); }
        .news-card-dark:hover .image-wrapper img { transform: scale(1.1); }

        .hot-badge {
          position: absolute; top: 15px; left: 15px;
          background: #ff6600; color: #fff;
          padding: 5px 12px; font-size: 11px; font-weight: bold;
          border-radius: 4px; z-index: 2;
        }

        .news-title { transition: 0.3s; line-height: 1.4 !important; }
        .news-card-dark:hover .news-title { color: #ff6600 !important; }

        .read-more-btn { color: #ff6600 !important; font-weight: bold; font-size: 12px; letter-spacing: 1px; }
        .read-more-btn:hover { color: #ff8533 !important; }

        /* Nhuộm tối component Empty của Antd */
        .ant-empty-img-simple-path { fill: #222 !important; }
        .ant-empty-img-simple-ellipse { fill: #111 !important; }
        .ant-empty-img-simple-g { stroke: #333 !important; }

        .mt-4 { margin-top: 1.5rem; }
        .mb-5 { margin-bottom: 3rem; }
      `}</style>
    </div>
  );
};

export default SoundNews;