import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import OrderCard from '@/components/OrderCard';
import { orders, categoryIcons, platformStats } from '@/lib/mockData';

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value]);

  return (
    <span ref={ref} style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
      {prefix}{display.toLocaleString()}
    </span>
  );
}

const bannerSlides = [
  {
    title: '达人接单平台',
    subtitle: '每日更新 1000+ 任务',
    highlight: '最高佣金 ¥5,000',
    btnText: '立即接单',
    bg: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/e4b2f418-4635-4a7f-9a49-be4523acca37.png',
  },
  {
    title: 'VIP高佣专区',
    subtitle: '精选优质商单，佣金翻倍',
    highlight: '限时开放中',
    btnText: '查看详情',
    bg: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/c9dc23a6-b510-4ef2-b4c4-ca93bc2e0e40.png',
  },
  {
    title: '新人专享福利',
    subtitle: '注册即送新手任务礼包',
    highlight: '首单奖励 ¥50',
    btnText: '立即领取',
    bg: 'https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/42c4a337-2027-4e7e-b55f-7cdc0756f942.png',
  },
];

function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerSlides.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (index: number) => {
    setCurrent(index);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  const slide = bannerSlides[current];

  return (
    <div
      className="relative overflow-hidden pt-10 pb-6 px-4 transition-all duration-700"
      style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)', minHeight: '260px' }}
    >
      {/* Background images for all slides - use opacity to transition */}
      {bannerSlides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 0.35 : 0 }}
        >
          <img src={s.bg} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B2D]/80 to-transparent z-[1]" />
      <div className="relative z-10">
        <div className="min-h-[140px]">
          <h1 className="text-white text-2xl font-bold mb-1">{slide.title}</h1>
          <p className="text-white/70 text-sm mb-1">{slide.subtitle}</p>
          <p className="text-[#16C784] text-base font-bold mb-4" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
            {slide.highlight}
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('task-feed');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.4)' }}
          >
            {slide.btnText}
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center gap-2 mt-4">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-1.5 bg-[#2F6BFF]' : 'w-2 h-1.5 bg-white/30'
              }`}
            />
          ))}
          <span className="ml-auto text-[10px] text-white/40">{current + 1}/{bannerSlides.length}</span>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesCategory = activeCategory === '全部' || order.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-20">
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Search Bar */}
      <div className="px-4 -mt-3 relative z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索任务标题或ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E6EAF2] rounded-xl text-sm text-[#0F1B2D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          />
        </div>
      </div>

      {/* Platform Stats */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 grid grid-cols-4 gap-2" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div className="text-center">
            <p className="text-lg font-bold text-[#0F1B2D]">
              <AnimatedNumber value={platformStats.totalTasks} />
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">累计任务</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#2F6BFF]">
              <AnimatedNumber value={platformStats.todayTasks} />
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">今日任务</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#0F1B2D]">
              <AnimatedNumber value={platformStats.totalCreators} />
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">达人数量</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#16C784]">
              <AnimatedNumber value={Math.floor(platformStats.totalCommission / 10000)} prefix="¥" />
              <span className="text-xs font-normal text-gray-400">万</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">累计佣金</p>
          </div>
        </div>
      </div>

      {/* Category Icons - no title */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(categoryIcons).map(([name, icon]) => (
            <button
              key={name}
              onClick={() => setActiveCategory(activeCategory === name ? '全部' : name)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                activeCategory === name
                  ? 'bg-[#2F6BFF]/10 ring-1 ring-[#2F6BFF]/30'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={{ boxShadow: activeCategory === name ? 'none' : '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <span className="text-2xl">{icon}</span>
              <span className={`text-[10px] font-medium ${
                activeCategory === name ? 'text-[#2F6BFF]' : 'text-gray-600'
              }`}>
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Order Feed - no tabs */}
      <div className="px-4 mt-4" id="task-feed">
        {activeCategory !== '全部' && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#0F1B2D]">{activeCategory}</span>
            <button
              onClick={() => setActiveCategory('全部')}
              className="flex items-center gap-0.5 text-xs text-[#2F6BFF]"
            >
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">暂无匹配的任务</p>
              <button
                onClick={() => { setActiveCategory('全部'); setSearchQuery(''); }}
                className="mt-2 text-xs text-[#2F6BFF] font-medium"
              >
                查看全部任务
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}