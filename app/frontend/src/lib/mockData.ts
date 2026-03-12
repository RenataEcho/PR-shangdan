export interface Order {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: '全部' | 'App推广' | '小说' | '剧宣' | '电商' | '游戏推广';
  priceType: 'fixed' | 'range' | 'negotiable';
  priceFixed?: string;
  priceMin?: number;
  priceMax?: number;
  priceLabel?: string;
  statusTag: string;
  statusColor: 'green' | 'orange' | 'red';
  tags: string[];
  requirements: string[];
  settlementRules: string;
  threshold: string[];
  detailDescription: string;
  steps: string[];
}

export interface Task {
  id: string;
  orderId: string;
  orderTitle: string;
  coverImage: string;
  commission: string;
  currentStep: number;
  steps: { label: string; status: 'done' | 'current' | 'pending' }[];
  materials: { name: string; url: string }[];
  messages: { sender: string; content: string; time: string; isMe: boolean }[];
}

export interface WalletInfo {
  balance: number;
  pendingAmount: number;
  totalEarned: number;
  todayEarned: number;
  records: { id: string; title: string; amount: number; type: 'income' | 'withdraw'; date: string; status: string }[];
}

export const categories = ['全部', 'App推广', '小说', '剧宣', '电商', '游戏推广'] as const;

export const categoryIcons: Record<string, string> = {
  'App推广': '📱',
  '小说': '📖',
  '剧宣': '🎬',
  '电商': '🛒',
  '游戏推广': '🎮',
};

export const platformStats = {
  totalTasks: 23456,
  todayTasks: 186,
  totalCreators: 8923,
  totalCommission: 12580000,
};

export const orders: Order[] = [
  {
    id: 'SD20260301',
    title: '抖音短视频推广 - 记账App',
    description: '拍摄15-60秒短视频推广记账类App，需展示App核心功能并引导下载',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/c95c1516-0b7f-4a45-bdd7-6276b99b0b09.png',
    category: 'App推广',
    priceType: 'fixed',
    priceFixed: '¥35',
    statusTag: '火热报名中',
    statusColor: 'green',
    tags: ['官方任务', 'CPA'],
    requirements: ['视频时长15-60秒', '需展示App下载及核心功能', '不得出现竞品信息', '需在视频描述中添加指定话题标签'],
    settlementRules: '视频发布后72小时内审核，审核通过后7个工作日内结算。单条视频播放量超过5000可获得额外奖励。',
    threshold: ['需绑定抖音号', '粉丝数 > 1000', '近30天有发布作品'],
    detailDescription: '我们正在寻找优质创作者为一款全新记账App进行短视频推广。该App主打简洁易用的记账体验，支持AI智能分类和月度报表。希望创作者能以生活化的方式展示App的使用场景。',
    steps: ['领取任务素材', '拍摄并发布视频', '提交视频链接', '等待审核结算'],
  },
  {
    id: 'SD20260302',
    title: '网文小说推广 - 都市修仙',
    description: '以口播或剧情形式推广热门网文《都市修仙指南》，引导用户阅读',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/8e42d12f-fa81-46dc-8c28-b3cdff856e99.png',
    category: '小说',
    priceType: 'range',
    priceMin: 50,
    priceMax: 500,
    statusTag: '余量: 12',
    statusColor: 'orange',
    tags: ['高佣任务'],
    requirements: ['视频时长30秒以上', '需包含小说核心剧情片段', '引导语需包含"点击链接阅读"', '不得剧透结局'],
    settlementRules: '按引导阅读量结算，每个有效阅读¥0.5，单条视频上限¥500。每周五统一结算。',
    threshold: ['需绑定抖音号', '粉丝数 > 500'],
    detailDescription: '《都市修仙指南》是一部热门都市修仙网文，讲述普通上班族意外获得修仙传承的故事。需要创作者以吸引人的方式展示小说精彩片段，激发观众阅读兴趣。',
    steps: ['阅读小说大纲', '撰写推广文案', '拍摄发布视频', '提交审核'],
  },
  {
    id: 'SD20260303',
    title: '电视剧《星河之约》宣传推广',
    description: '为即将上映的科幻爱情剧《星河之约》制作宣传短视频，提升曝光度',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/c9dc23a6-b510-4ef2-b4c4-ca93bc2e0e40.png',
    category: '剧宣',
    priceType: 'fixed',
    priceFixed: '¥200',
    statusTag: '火热报名中',
    statusColor: 'green',
    tags: ['VIP任务', '官方任务'],
    requirements: ['使用官方提供的剧照和预告片素材', '视频时长15-45秒', '需添加指定话题标签 #星河之约', '发布时间需在指定档期内'],
    settlementRules: '审核通过即结算基础费用¥200，播放量超10万额外奖励¥100。',
    threshold: ['需绑定抖音号', '粉丝数 > 2000', '影视类内容创作者优先'],
    detailDescription: '《星河之约》是一部大制作科幻爱情电视剧，由知名导演执导。剧情讲述了来自不同星球的两个人跨越星际的爱情故事。我们需要创作者帮助提升剧集的社交媒体曝光度。',
    steps: ['下载官方素材', '制作宣传视频', '按档期发布', '提交审核'],
  },
  {
    id: 'SD20260304',
    title: '春季女装上新带货',
    description: '为春季新款女装进行短视频带货推广，展示穿搭效果并引导购买',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/ec0cc63c-4901-4cf1-8c26-145be05a5805.png',
    category: '电商',
    priceType: 'negotiable',
    priceLabel: '按量结算',
    statusTag: '余量: 5',
    statusColor: 'orange',
    tags: ['高佣任务'],
    requirements: ['需真人出镜试穿展示', '视频时长30秒以上', '需挂载商品橱窗链接', '展示至少3套穿搭方案'],
    settlementRules: '按实际成交订单量结算佣金，佣金比例15%-25%，具体根据商品类目确定。T+15结算。',
    threshold: ['需绑定抖音号', '粉丝数 > 3000', '需开通商品橱窗', '女性创作者优先'],
    detailDescription: '某知名女装品牌春季上新，共20+款春装新品。需要时尚类创作者进行穿搭展示和带货推广，产品包括连衣裙、外套、衬衫等品类，风格偏轻熟优雅。',
    steps: ['申请样品', '拍摄穿搭视频', '挂载商品链接', '发布并提交'],
  },
  {
    id: 'SD20260305',
    title: '健身App推广 - 每日打卡',
    description: '推广健身打卡App，展示运动记录和社区功能，引导下载注册',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/c95c1516-0b7f-4a45-bdd7-6276b99b0b09.png',
    category: 'App推广',
    priceType: 'range',
    priceMin: 80,
    priceMax: 300,
    statusTag: '火热报名中',
    statusColor: 'green',
    tags: ['官方任务', 'CPA'],
    requirements: ['需真实使用App并展示界面', '视频时长20-60秒', '需展示打卡和社区功能', '运动健身类创作者优先'],
    settlementRules: '基础稿费¥80/条，每带来一个有效注册用户额外奖励¥2，上限¥300/条。',
    threshold: ['需绑定抖音号', '粉丝数 > 800', '运动健身类内容优先'],
    detailDescription: '一款全新的健身打卡App，主打社区互动和AI运动计划。希望创作者以真实运动场景展示App功能，激励观众下载使用。',
    steps: ['下载并体验App', '拍摄使用视频', '发布并添加标签', '提交审核'],
  },
  {
    id: 'SD20260306',
    title: '悬疑小说推广 - 《迷雾追踪》',
    description: '以悬疑解说或剧情演绎形式推广悬疑小说，制造悬念引导阅读',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/8e42d12f-fa81-46dc-8c28-b3cdff856e99.png',
    category: '小说',
    priceType: 'fixed',
    priceFixed: '¥150',
    statusTag: '余量: 8',
    statusColor: 'orange',
    tags: ['VIP任务'],
    requirements: ['视频时长45秒以上', '需营造悬疑氛围', '结尾需设置悬念引导阅读', '可使用AI配音'],
    settlementRules: '审核通过即结算¥150，播放量超5万额外奖励¥50。每周三统一结算。',
    threshold: ['需绑定抖音号', '粉丝数 > 1000'],
    detailDescription: '《迷雾追踪》是一部烧脑悬疑小说，讲述一位退休刑警重新调查20年前悬案的故事。需要创作者以吸引人的悬疑解说方式展示故事亮点。',
    steps: ['阅读小说大纲', '撰写悬疑文案', '制作解说视频', '提交审核'],
  },
];

export const myTasks: Task[] = [
  {
    id: 'T001',
    orderId: 'SD20260301',
    orderTitle: '抖音短视频推广 - 记账App',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/c95c1516-0b7f-4a45-bdd7-6276b99b0b09.png',
    commission: '¥35',
    currentStep: 2,
    steps: [
      { label: '报名审核', status: 'done' },
      { label: '文案审核', status: 'done' },
      { label: '视频审核', status: 'current' },
      { label: '数据确认', status: 'pending' },
      { label: '结算', status: 'pending' },
    ],
    materials: [
      { name: 'App推广素材包.zip', url: '#' },
      { name: '推广话术参考.pdf', url: '#' },
      { name: '专属推广链接', url: 'https://example.com/promo/abc123' },
    ],
    messages: [
      { sender: '审核员小王', content: '你好，文案已审核通过，请尽快拍摄视频上传。', time: '2026-03-10 14:30', isMe: false },
      { sender: '我', content: '好的，预计明天上传视频初稿。', time: '2026-03-10 15:00', isMe: true },
      { sender: '审核员小王', content: '收到，注意视频中需要清晰展示App的记账功能哦~', time: '2026-03-10 15:05', isMe: false },
    ],
  },
  {
    id: 'T002',
    orderId: 'SD20260303',
    orderTitle: '电视剧《星河之约》宣传推广',
    coverImage: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/c9dc23a6-b510-4ef2-b4c4-ca93bc2e0e40.png',
    commission: '¥200',
    currentStep: 1,
    steps: [
      { label: '报名审核', status: 'done' },
      { label: '文案审核', status: 'current' },
      { label: '视频审核', status: 'pending' },
      { label: '数据确认', status: 'pending' },
      { label: '结算', status: 'pending' },
    ],
    materials: [
      { name: '官方剧照素材包.zip', url: '#' },
      { name: '预告片片段.mp4', url: '#' },
    ],
    messages: [
      { sender: '审核员小李', content: '欢迎参与《星河之约》推广！请先提交文案大纲。', time: '2026-03-11 10:00', isMe: false },
    ],
  },
];

export const walletInfo: WalletInfo = {
  balance: 1280.50,
  pendingAmount: 350.00,
  totalEarned: 5680.00,
  todayEarned: 560.00,
  records: [
    { id: 'R001', title: '记账App推广结算', amount: 100, type: 'income', date: '2026-03-08', status: '已到账' },
    { id: 'R002', title: '提现到支付宝', amount: -500, type: 'withdraw', date: '2026-03-06', status: '已完成' },
    { id: 'R003', title: '小说推广结算', amount: 230, type: 'income', date: '2026-03-03', status: '已到账' },
    { id: 'R004', title: '剧宣推广结算', amount: 200, type: 'income', date: '2026-02-28', status: '已到账' },
    { id: 'R005', title: '提现到银行卡', amount: -800, type: 'withdraw', date: '2026-02-25', status: '已完成' },
    { id: 'R006', title: 'App推广额外奖励', amount: 50, type: 'income', date: '2026-02-20', status: '已到账' },
  ],
};

export const userProfile = {
  name: '创作者小明',
  avatar: '',
  douyinId: 'xiaoming_2026',
  followers: 12500,
  level: 'LV.3 优质创作者',
  completedOrders: 15,
  totalEarnings: 5680,
  todayEarnings: 560,
  phone: '138****8888',
};