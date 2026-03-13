import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  Bell,
  FileText,
  CreditCard,
  Wallet,
  Eye,
  EyeOff,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  MonitorSmartphone,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { userProfile, walletInfo } from '@/lib/mockData';
import { toast } from 'sonner';

function AnimatedAmount({ value, className, hidden }: { value: number; className?: string; hidden?: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (hidden) return;
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value, hidden]);

  if (hidden) {
    return <span className={className}>****</span>;
  }

  return (
    <span className={className} style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
      {display.toFixed(2)}
    </span>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [amountVisible, setAmountVisible] = useState(true);

  const handleWithdraw = () => {
    navigate('/wallet/withdraw');
  };

  const walletActions = [
    { icon: FileText, label: '收支明细', color: '#16C784', action: () => navigate('/wallet/records') },
    { icon: CreditCard, label: '收款账户', color: '#2F6BFF', action: () => navigate('/wallet/accounts') },
    { icon: ArrowDownToLine, label: '提现', color: '#FF6B35', action: handleWithdraw },
  ];

  const menuItems = [
    { icon: MonitorSmartphone, label: '媒体账号', desc: '管理绑定的媒体账号', color: 'text-[#2F6BFF]', bgColor: 'bg-[#2F6BFF]/10', path: '/media-accounts' },
    { icon: Bell, label: '消息通知', desc: '系统消息和通知', color: 'text-[#6C8CFF]', bgColor: 'bg-[#6C8CFF]/10' },
    { icon: Shield, label: '账号安全', desc: '密码和绑定设置', color: 'text-[#16C784]', bgColor: 'bg-[#16C784]/10' },
    { icon: HelpCircle, label: '帮助中心', desc: '常见问题解答', color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { icon: Settings, label: '设置', desc: '通用设置', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-20">
      {/* Combined Header + Wallet: single continuous dark block */}
      <div
        className="relative pb-0"
        style={{ background: 'linear-gradient(180deg, #0F1B2D 0%, #162D50 40%, #1A3050 100%)' }}
      >
        {/* User Info */}
        <div className="pt-12 px-5 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2F6BFF] to-[#6C8CFF] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20 ring-2 ring-white/10">
              {userProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-white text-base font-bold truncate">{userProfile.name}</h1>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-[#2F6BFF]/30 to-[#6C8CFF]/30 text-[#8BABFF] border border-[#2F6BFF]/20">
                  {userProfile.level}
                </span>
              </div>
              <p className="text-white/40 text-xs mt-1">抖音号: {userProfile.douyinId}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-white/40 text-[11px]">
                  粉丝 <span className="text-white/70 font-medium">{(userProfile.followers / 10000).toFixed(1)}万</span>
                </span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 text-[11px]">
                  已完成 <span className="text-white/70 font-medium">{userProfile.completedOrders}</span> 单
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="mx-5 border-t border-white/[0.06]" />

        {/* Wallet Balance Section - same dark background, no card separation */}
        <div className="px-5 pt-4 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#6C8CFF]" />
              <span className="text-white/50 text-xs">我的钱包</span>
            </div>
            <button
              onClick={() => setAmountVisible(!amountVisible)}
              className="flex items-center gap-1 text-white/40 text-[10px] active:text-white/60 transition-colors"
            >
              {amountVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Main Balance */}
          <div className="mb-4">
            <p className="text-white/40 text-[10px] mb-1">账户余额 (元)</p>
            <div className="flex items-end gap-1">
              <span className="text-white/50 text-lg" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>¥</span>
              <AnimatedAmount
                value={walletInfo.balance}
                className="text-white text-3xl font-bold leading-none"
                hidden={!amountVisible}
              />
            </div>
          </div>

          {/* Sub amounts */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white/[0.06] rounded-xl p-2.5">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-yellow-400/70" />
                <span className="text-white/40 text-[10px]">待结算</span>
              </div>
              <p className="text-white/90 text-sm font-bold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                {amountVisible ? `¥${walletInfo.pendingAmount.toFixed(2)}` : '****'}
              </p>
            </div>
            <div className="bg-white/[0.06] rounded-xl p-2.5">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-[#16C784]/70" />
                <span className="text-white/40 text-[10px]">今日收入</span>
              </div>
              <p className="text-[#16C784] text-sm font-bold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                {amountVisible ? `¥${walletInfo.todayEarned.toFixed(2)}` : '****'}
              </p>
            </div>
            <div className="bg-white/[0.06] rounded-xl p-2.5">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-[#2F6BFF]/70" />
                <span className="text-white/40 text-[10px]">累计收入</span>
              </div>
              <p className="text-white/90 text-sm font-bold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                {amountVisible ? `¥${walletInfo.totalEarned.toFixed(2)}` : '****'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Quick Actions - white bar that bridges dark area to light content */}
      <div className="px-4 -mt-0">
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginTop: '-12px', position: 'relative', zIndex: 10 }}
        >
          <div className="grid grid-cols-3">
            {walletActions.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className={`flex flex-col items-center gap-1.5 py-3.5 active:bg-gray-50 transition-colors ${
                    i < walletActions.length - 1 ? 'border-r border-[#F0F2F5]' : ''
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <Icon style={{ color: item.color, width: 16, height: 16 }} />
                  </div>
                  <span className="text-[11px] text-[#0F1B2D] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => (item as any).path ? navigate((item as any).path) : toast.info(`${item.label}功能开发中`)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F8FF] transition-colors ${
                  i < menuItems.length - 1 ? 'border-b border-[#F0F2F5]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F1B2D]">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-3 mb-2">
        <button
          onClick={() => toast.info('退出登录功能开发中')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl text-red-400 text-sm font-medium active:bg-red-50 transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>

      <BottomNav />
    </div>
  );
}