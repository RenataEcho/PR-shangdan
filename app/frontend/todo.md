# 商单平台 - 开发计划

## Design Guidelines

### Design References
- **抖音创作者平台**: Mobile-first, clean card layouts, vibrant accents
- **美团/饿了么**: Tab navigation, feed-style listings
- **Style**: Modern Mobile App + Clean Cards + Warm Gradient Accents

### Color Palette
- Primary: #FF6B35 (Warm Orange - main accent, CTAs)
- Secondary: #FF8C5A (Light Orange - hover states)
- Background: #F5F5F7 (Light Gray - page background)
- Card: #FFFFFF (White - card backgrounds)
- Text Primary: #1A1A2E (Dark Navy - headings)
- Text Secondary: #6B7280 (Gray - descriptions)
- Success: #10B981 (Green - status indicators)
- Warning: #F59E0B (Amber - pending states)
- Danger: #EF4444 (Red - important alerts)

### Typography
- Heading1: Inter font-weight 700 (24px)
- Heading2: Inter font-weight 600 (18px)
- Body: Inter font-weight 400 (14px)
- Caption: Inter font-weight 400 (12px)

### Key Component Styles
- **Cards**: White bg, rounded-xl (16px), shadow-sm, hover:shadow-md transition
- **Buttons**: Orange gradient bg, white text, rounded-full, py-3
- **Tags/Badges**: Rounded-full, small padding, colored backgrounds
- **Bottom Nav**: Fixed bottom, white bg, shadow-top, 4 equal tabs with icons
- **Search Bar**: Rounded-full, gray bg, search icon left

### Images to Generate
1. **order-cover-app.jpg** - Mobile app promotion banner, colorful smartphone mockup with app icons (Style: minimalist, vibrant)
2. **order-cover-novel.jpg** - Novel/reading promotion banner, open book with magical light effects (Style: fantasy, warm tones)
3. **order-cover-drama.jpg** - Drama/show promotion banner, movie clapperboard with spotlight (Style: cinematic, dramatic)
4. **order-cover-ecommerce.jpg** - E-commerce promotion banner, shopping bags and products arrangement (Style: clean, commercial)

---

## Development Files

1. **src/pages/Index.tsx** - 首页/商单大厅 Feed流 (搜索框、分类筛选、商单卡片列表)
2. **src/pages/OrderDetail.tsx** - 商单详情页 (介绍、要求、结算规则、报名按钮)
3. **src/pages/TaskCenter.tsx** - 任务执行中心 (进度条、资料下载、提交、沟通区)
4. **src/pages/Wallet.tsx** - 钱包页面 (余额、收益明细、提现)
5. **src/pages/Profile.tsx** - 我的页面 (个人信息、已报名商单、设置)
6. **src/components/BottomNav.tsx** - 底部导航栏组件
7. **src/components/OrderCard.tsx** - 商单卡片组件
8. **src/lib/mockData.ts** - Mock数据 (商单列表、任务数据等)