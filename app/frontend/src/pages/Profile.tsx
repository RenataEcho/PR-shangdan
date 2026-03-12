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
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { userProfile, walletInfo } from '@/lib/mockData';
import { toast } from 'sonner';

function AnimatedAmount({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
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
  }, [value]);

  return (
    <span className={className} style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
      ¥ {display.toFixed(2)}
    </span>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  const handleWithdraw = () => {
    navigate('/wallet/withdraw');
  };

  const menuItems = [
    { icon: FileText, label: '收支明细', desc: '查看全部收支记录', color: 'text-[#16C784]', bgColor: 'bg-[#16C784]/10', action: () => navigate('/wallet/records') },
    { icon: CreditCard, label: '收款帐户', desc: '管理绑定的收款账户', color: 'text-[#2F6BFF]', bgColor: 'bg-[#2F6BFF]/10', action: () => navigate('/wallet/accounts') },
    { icon: Bell, label: '消息通知', desc: '系统消息和通知', color: 'text-[#6C8CFF]', bgColor: 'bg-[#6C8CFF]/10' },
    { icon: Shield, label: '账号安全', desc: '密码和绑定设置', color: 'text-[#16C784]', bgColor: 'bg-[#16C784]/10' },
    { icon: HelpCircle, label: '帮助中心', desc: '常见问题解答', color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { icon: Settings, label: '设置', desc: '通用设置', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-20">
      {/* Profile Header */}
      <div className="pt-10 pb-8 px-4" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white border border-white/20">
            {userProfile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-white text-lg font-bold">{userProfile.name}</h1>
            <p className="text-white/50 text-xs mt-0.5">抖音号: {userProfile.douyinId}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#2F6BFF]/20 text-[#6C8CFF]">
                {userProfile.level}
              </span>
              <span className="text-white/40 text-[10px]">
                粉丝 {(userProfile.followers / 10000).toFixed(1)}万
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl p-4 grid grid-cols-3 gap-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div className="text-center">
            <p className="text-xl font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              {userProfile.completedOrders}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">已完成商单</p>
          </div>
          <div className="text-center border-x border-[#E6EAF2]">
            <p className="text-xl font-bold text-[#2F6BFF]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              {userProfile.mediaAccounts}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">媒体账号</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#2F6BFF]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              {userProfile.daysJoined}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">加入平台</p>
          </div>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1A3A5C 100%)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60 text-xs">我的钱包</p>
            <div className="flex items-center gap-3 text-white/40 text-[10px]">
              <span>待结算 ¥{walletInfo.pendingAmount.toFixed(2)}</span>
              <span>·</span>
              <span>累计 ¥{walletInfo.totalEarned.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/40 text-[10px] mb-0.5">账户余额</p>
              <AnimatedAmount value={walletInfo.balance} className="text-white text-2xl font-bold" />
            </div>
            <button
              onClick={handleWithdraw}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white active:scale-[0.97] transition-transform"
              style={{ background: '#16C784', boxShadow: '0 4px 12px rgba(22,199,132,0.3)' }}
            >
              立即提现
            </button>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action ? item.action : () => toast.info(`${item.label}功能开发中`)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F8FF] transition-colors ${
                  i < menuItems.length - 1 ? 'border-b border-[#E6EAF2]' : ''
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
      <div className="px-4 mt-3">
        <button
          onClick={() => toast.info('退出登录功能开发中')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl text-red-500 text-sm font-medium active:bg-red-50 transition-colors"
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