import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Input, Select, Button, Space, Typography, Tooltip, Badge } from 'antd';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend } from 'recharts';
import { UserAddOutlined, VideoCameraOutlined, HeartOutlined, EyeOutlined, RiseOutlined, FallOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { accounts, generateFollowerTrend, generateVideos, getGlobalStats } from './data/mockData';
import './App.css';

const { Title, Text } = Typography;

const StatCard = ({ title, value, suffix, icon, color, trend }) => (
  <div className="stat-card" style={{ '--accent': color }}>
    <div className="stat-card-icon" style={{ background: `${color}18` }}>
      {icon}
    </div>
    <div className="stat-card-body">
      <Text className="stat-label">{title}</Text>
      <div className="stat-value-row">
        <span className="stat-value">{value}</span>
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
      {trend !== undefined && (
        <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? <RiseOutlined /> : <FallOutlined />}
          <span>{Math.abs(trend).toLocaleString()} 今日</span>
        </div>
      )}
    </div>
  </div>
);

const FollowerChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={160}>
    <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
      <defs>
        <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ff0050" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#ff0050" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
      <XAxis dataKey="date" tick={{ fill: '#ffffff60', fontSize: 10 }} tickLine={false} axisLine={false} />
      <YAxis tick={{ fill: '#ffffff60', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
      <ReTooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8, color: '#fff' }} formatter={(v) => v.toLocaleString()} />
      <Area type="monotone" dataKey="followers" stroke="#ff0050" strokeWidth={2} fill="url(#followerGrad)" dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

const VideoBarChart = ({ videos }) => {
  const data = videos.slice(0, 7).map(v => ({
    title: v.title.length > 12 ? v.title.slice(0, 12) + '…' : v.title,
    views: v.views,
    likes: v.likes,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="title" tick={{ fill: '#ffffff60', fontSize: 9 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#ffffff60', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
        <ReTooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8, color: '#fff' }} formatter={v => v.toLocaleString()} />
        <Legend wrapperStyle={{ color: '#fff', fontSize: 12 }} />
        <Bar dataKey="views" fill="#00f2ea" radius={[4, 4, 0, 0]} name="播放" />
        <Bar dataKey="likes" fill="#ff0050" radius={[4, 4, 0, 0]} name="点赞" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const formatNum = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const App = () => {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const stats = getGlobalStats();
  const trend = generateFollowerTrend(selectedAccount.id, selectedAccount.followers);
  const videos = generateVideos(selectedAccount.id, selectedAccount.nickname);

  const filteredAccounts = accounts.filter(a => {
    const matchSearch = a.nickname.toLowerCase().includes(searchText.toLowerCase()) || a.username.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const videoColumns = [
    { title: '标题', dataIndex: 'title', key: 'title', render: t => <Text style={{ color: '#e0e0e0', fontSize: 12 }}>{t}</Text> },
    { title: '播放量', dataIndex: 'views', key: 'views', render: v => <Tag color="cyan">{formatNum(v)}</Tag> },
    { title: '点赞', dataIndex: 'likes', key: 'likes', render: v => <Tag color="magenta">{formatNum(v)}</Tag> },
    { title: '评论', dataIndex: 'comments', key: 'comments', render: v => <Tag color="purple">{formatNum(v)}</Tag> },
    { title: '分享', dataIndex: 'shares', key: 'shares', render: v => <Tag color="blue">{formatNum(v)}</Tag> },
    { title: '互动率', dataIndex: 'engagement', key: 'engagement', render: e => <Text style={{ color: Number(e) > 5 ? '#52c41a' : '#faad14' }}>{e}%</Text> },
    { title: '发布时间', dataIndex: 'postedAt', key: 'postedAt', render: t => <Text style={{ color: '#888', fontSize: 12 }}>{t}</Text> },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="url(#logoGrad)"/>
              <path d="M19.5 10.5C19.5 10.5 20.5 12.8 20.5 14C20.5 15.2 19.5 17.5 19.5 17.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="14" cy="14" r="1.5" fill="#fff"/>
              <circle cx="8.5" cy="14" r="1.5" fill="#fff"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#00f2ea"/>
                  <stop offset="1" stopColor="#ff0050"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: '#fff', fontWeight: 700 }}>TikTok 数据看板</Title>
            <Text style={{ color: '#ffffff60', fontSize: 11 }}>多账号运营监控平台</Text>
          </div>
        </div>
        <div className="header-right">
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="搜索账号…" value={searchText} onChange={e => setSearchText(e.target.value)} style={{ width: 180, background: '#ffffff10', borderColor: '#ffffff20', color: '#fff' }} />
            <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 120 }} options={[{ value: 'all', label: '全部账号' }, { value: 'active', label: '活跃' }, { value: 'dormant', label: '沉寂' }]} />
            <Button icon={<PlusOutlined />} type="primary" style={{ background: 'linear-gradient(135deg, #00f2ea, #ff0050)', border: 'none' }}>+ 添加账号</Button>
          </Space>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Stats Row */}
        <Row gutter={[16, 16]} className="stats-row">
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="监控账号" value={stats.totalAccounts} icon={<UserAddOutlined style={{ color: '#00f2ea', fontSize: 22 }} />} color="#00f2ea" trend={2} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="总粉丝量" value={formatNum(stats.totalFollowers)} icon={<span style={{ fontSize: 22 }}>👥</span>} color="#ff0050" trend={12400} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="总作品数" value={stats.totalVideos.toLocaleString()} icon={<VideoCameraOutlined style={{ color: '#7c3aed', fontSize: 22 }} />} color="#7c3aed" trend={18} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard title="平均互动率" value={stats.avgEngagement + '%'} icon={<HeartOutlined style={{ color: '#f59e0b', fontSize: 22 }} />} color="#f59e0b" trend={0.3} />
          </Col>
        </Row>

        {/* Account Grid */}
        <div className="section-title">
          <Text strong style={{ color: '#fff', fontSize: 15 }}>账号列表</Text>
          <Text style={{ color: '#ffffff50', fontSize: 12 }}>点击账号查看详情</Text>
        </div>
        <div className="account-grid">
          {filteredAccounts.map(a => (
            <div key={a.id} className={`account-card ${selectedAccount.id === a.id ? 'active' : ''}`} onClick={() => setSelectedAccount(a)}>
              <div className="account-card-header">
                <img src={a.avatar} alt={a.nickname} className="account-avatar" />
                <div className="account-info">
                  <Text strong style={{ color: '#fff', fontSize: 13 }}>{a.nickname}</Text>
                  <Text style={{ color: '#ffffff60', fontSize: 11 }}>{a.username}</Text>
                </div>
                <Badge status={a.status === 'active' ? 'success' : 'default'} text={<Text style={{ fontSize: 10, color: '#888' }}>{a.status === 'active' ? '活跃' : '沉寂'}</Text>} />
              </div>
              <div className="account-metrics">
                <div className="metric">
                  <Text style={{ color: '#ffffff60', fontSize: 11 }}>粉丝</Text>
                  <Text style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{formatNum(a.followers)}</Text>
                </div>
                <div className="metric">
                  <Text style={{ color: '#ffffff60', fontSize: 11 }}>作品</Text>
                  <Text style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{a.videos}</Text>
                </div>
                <div className="metric">
                  <Text style={{ color: '#ffffff60', fontSize: 11 }}>互动率</Text>
                  <Text style={{ color: a.engagement > 6 ? '#52c41a' : '#faad14', fontWeight: 600, fontSize: 14 }}>{a.engagement}%</Text>
                </div>
              </div>
              <Progress percent={Math.min(a.engagement * 10, 100)} showInfo={false} strokeColor={{ '0%': '#00f2ea', '100%': '#ff0050' }} trailColor="#ffffff15" size="small" />
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="detail-panel">
          <div className="detail-header">
            <div className="detail-account-info">
              <img src={selectedAccount.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #ff0050' }} />
              <div>
                <Title level={5} style={{ margin: 0, color: '#fff' }}>{selectedAccount.nickname}</Title>
                <Text style={{ color: '#ffffff60', fontSize: 12 }}>{selectedAccount.username} · {selectedAccount.videos} 个作品</Text>
              </div>
            </div>
            <div className="detail-metrics">
              <div className="dmetric">
                <EyeOutlined style={{ color: '#00f2ea' }} />
                <span>{formatNum(selectedAccount.followers)}</span>
                <Text type="secondary" style={{ fontSize: 10 }}>粉丝</Text>
              </div>
              <div className="dmetric">
                <VideoCameraOutlined style={{ color: '#7c3aed' }} />
                <span>{selectedAccount.videos}</span>
                <Text type="secondary" style={{ fontSize: 10 }}>作品</Text>
              </div>
              <div className="dmetric">
                <HeartOutlined style={{ color: '#ff0050' }} />
                <span>{formatNum(selectedAccount.likes)}</span>
                <Text type="secondary" style={{ fontSize: 10 }}>总赞</Text>
              </div>
              <div className="dmetric">
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 18 }}>{selectedAccount.engagement}%</span>
                <Text type="secondary" style={{ fontSize: 10 }}>互动率</Text>
              </div>
            </div>
          </div>

          <Row gutter={16}>
            <Col xs={24} lg={10}>
              <Card className="chart-card" title={<Text style={{ color: '#fff', fontSize: 13 }}>📈 粉丝趋势（近30天）</Text>} extra={<Tag color="magenta">+{trend[trend.length-1]?.delta > 0 ? '+' : ''}{trend[trend.length-1]?.delta?.toLocaleString()}</Tag>}>
                <FollowerChart data={trend} />
              </Card>
            </Col>
            <Col xs={24} lg={14}>
              <Card className="chart-card" title={<Text style={{ color: '#fff', fontSize: 13 }}>🎬 作品数据 TOP7</Text>} extra={<Button size="small" icon={<ReloadOutlined />}>刷新</Button>}>
                <VideoBarChart videos={videos} />
              </Card>
            </Col>
          </Row>

          <Card className="chart-card" title={<Text style={{ color: '#fff', fontSize: 13 }}>📋 作品列表</Text>} extra={<Space><Button size="small" icon={<PlusOutlined />}>添加监控</Button><Button size="small" danger icon={<DeleteOutlined />}>删除账号</Button></Space>}>
            <Table dataSource={videos} columns={videoColumns} rowKey="id" size="small" pagination={{ pageSize: 6 }} style={{ background: 'transparent' }} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
