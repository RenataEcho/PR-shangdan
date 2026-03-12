import { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpCircle, Wallet as WalletIcon, ChevronRight, FileText, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { walletInfo } from '@/lib/mockData';
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

export default function Wallet() {
  const navigate = useNavigate();

  const handleWithdraw = () => {
    toast.info('提现功能开发中，敬请期待');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-20">
      {/* Header with Balance */}
      <div className="pt-10 pb-8 px-4" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}>
        <h1 className="text-white text-xl font-bold mb-5">我的钱包</h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <p className="text-white/50 text-xs mb-1">账户余额 (元)</p>
          <AnimatedAmount value={walletInfo.balance} className="text-white text-3xl font-bold" />
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <p className="text-white/40 text-[10px]">待结算</p>
              <p className="text-white text-sm font-semibold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                ¥ {walletInfo.pendingAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex-1">
              <p className="text-white/40 text-[10px]">累计收入</p>
              <p className="text-white text-sm font-semibold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                ¥ {walletInfo.totalEarned.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleWithdraw}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform text-white"
          style={{ background: '#16C784', boxShadow: '0 4px 16px rgba(22,199,132,0.3)' }}
        >
          立即提现
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-3 relative z-10 grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-xl p-3 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <TrendingUp className="w-5 h-5 text-[#16C784] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
            {walletInfo.records.filter(r => r.type === 'income').length}
          </p>
          <p className="text-[10px] text-gray-400">收入笔数</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <ArrowUpCircle className="w-5 h-5 text-[#2F6BFF] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
            {walletInfo.records.filter(r => r.type === 'withdraw').length}
          </p>
          <p className="text-[10px] text-gray-400">提现笔数</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <WalletIcon className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
            ¥{(walletInfo.totalEarned - walletInfo.balance - walletInfo.pendingAmount).toFixed(0)}
          </p>
          <p className="text-[10px] text-gray-400">已提现</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4 space-y-3">
        <div
          className="bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
          style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
          onClick={() => navigate('/wallet/records')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16C784]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#16C784]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1B2D]">收支明细</p>
              <p className="text-[10px] text-gray-400">查看全部收支记录</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>

        <div
          className="bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
          style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
          onClick={() => navigate('/wallet/accounts')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#2F6BFF]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1B2D]">收款帐户</p>
              <p className="text-[10px] text-gray-400">管理绑定的收款账户</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}