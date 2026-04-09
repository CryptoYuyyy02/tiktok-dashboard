import dayjs from 'dayjs';

// 模拟账号数据
export const accounts = [
  { id: 1, username: '@fashionista_ella', nickname: 'Ella时尚日记', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ella', followers: 284750, following: 892, likes: 1950000, videos: 342, avgViews: 48500, engagement: 6.8, status: 'active' },
  { id: 2, username: '@fitness_with_mike', nickname: 'Mike健身干货', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', followers: 156200, following: 341, likes: 890000, videos: 218, avgViews: 32100, engagement: 5.2, status: 'active' },
  { id: 3, username: '@foodie_chen', nickname: '陈好吃的探店', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen', followers: 523100, following: 1205, likes: 4200000, videos: 487, avgViews: 89200, engagement: 8.4, status: 'active' },
  { id: 4, username: '@travel_bunny', nickname: '旅行兔Rabbit', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bunny', followers: 98700, following: 564, likes: 620000, videos: 156, avgViews: 27800, engagement: 4.9, status: 'active' },
  { id: 5, username: '@comedy_king_88', nickname: '段子王88', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=king88', followers: 1250000, following: 88, likes: 15800000, videos: 623, avgViews: 210000, engagement: 9.1, status: 'active' },
  { id: 6, username: '@pet_paradise', nickname: '萌宠星球', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pets', followers: 342800, following: 203, likes: 3100000, videos: 298, avgViews: 62000, engagement: 7.3, status: 'active' },
  { id: 7, username: '@tech_guru_li', nickname: '李老师讲数码', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liguru', followers: 78900, following: 421, likes: 480000, videos: 134, avgViews: 19800, engagement: 5.6, status: 'dormant' },
  { id: 8, username: '@dance_studio_pro', nickname: '舞蹈工作室Pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dance', followers: 201500, following: 712, likes: 1800000, videos: 267, avgViews: 41200, engagement: 6.1, status: 'active' },
];

// 生成30天粉丝趋势数据
export const generateFollowerTrend = (accountId, baseFollowers) => {
  const data = [];
  let current = baseFollowers - Math.floor(Math.random() * 5000 + 2000);
  for (let i = 29; i >= 0; i--) {
    const delta = Math.floor((Math.random() - 0.3) * 300 + 50);
    current = Math.max(current + delta, baseFollowers * 0.9);
    data.push({
      date: dayjs().subtract(i, 'day').format('MM-DD'),
      followers: current,
      delta: delta,
    });
  }
  return data;
};

// 生成视频列表
export const generateVideos = (accountId, nickname) => {
  const topics = ['日常分享', '干货教程', '好物推荐', '搞笑合集', '挑战赛', '热点评论', '产品测评', '生活vlog'];
  const videos = [];
  for (let i = 0; i < 12; i++) {
    const views = Math.floor(Math.random() * 500000 + 5000);
    const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
    const comments = Math.floor(views * (Math.random() * 0.005 + 0.001));
    const shares = Math.floor(views * (Math.random() * 0.003 + 0.001));
    videos.push({
      id: `${accountId}-v${i + 1}`,
      title: `${nickname} · 第${i + 1}期 · ${topics[Math.floor(Math.random() * topics.length)]}`,
      views,
      likes,
      comments,
      shares,
      postedAt: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm'),
      duration: `${Math.floor(Math.random() * 50 + 10)}s`,
      engagement: ((likes + comments + shares) / views * 100).toFixed(1),
    });
  }
  return videos.sort((a, b) => b.views - a.views);
};

// 全局账号总览
export const getGlobalStats = () => ({
  totalAccounts: accounts.length,
  totalFollowers: accounts.reduce((sum, a) => sum + a.followers, 0),
  totalVideos: accounts.reduce((sum, a) => sum + a.videos, 0),
  totalLikes: accounts.reduce((sum, a) => sum + a.likes, 0),
  avgEngagement: (accounts.reduce((sum, a) => sum + a.engagement, 0) / accounts.length).toFixed(1),
  activeAccounts: accounts.filter(a => a.status === 'active').length,
});
