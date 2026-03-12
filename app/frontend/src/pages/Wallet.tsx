import { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet as WalletIcon } from 'lucide-react';
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

      {/* Today Earnings */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">今日收益</p>
              <p className="text-[#16C784] text-[32px] font-bold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                ¥{walletInfo.todayEarned.toFixed(0)}
              </p>
            </div>
            <img
              src="https://mgx-backend-cdn.metadl.com/generate/images/1020241/2026-03-12/42c4a337-2027-4e7e-b55f-7cdc0756f942.png"
              alt=""
              className="w-20 h-20 object-cover rounded-xl opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-3 grid grid-cols-3 gap-2.5">
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

      {/* Transaction Records */}
      <div className="px-4 mt-4">
        <h2 className="text-base font-semibold text-[#0F1B2D] mb-3">收支明细</h2>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          {walletInfo.records.map((record, i) => (
            <div
              key={record.id}
              className={`flex items-center justify-between px-4 py-3.5 ${
                i < walletInfo.records.length - 1 ? 'border-b border-[#E6EAF2]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    record.type === 'income' ? 'bg-[#16C784]/10' : 'bg-[#2F6BFF]/10'
                  }`}
                >
                  {record.type === 'income' ? (
                    <ArrowDownCircle className="w-4 h-4 text-[#16C784]" />
                  ) : (
                    <ArrowUpCircle className="w-4 h-4 text-[#2F6BFF]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F1B2D]">{record.title}</p>
                  <p className="text-[10px] text-gray-400">{record.date} · {record.status}</p>
                </div>
              </div>
              <span
                className="text-sm font-bold"
                style={{ fontFamily: '"DIN Alternate", "DIN", system-ui', color: record.type === 'income' ? '#16C784' : '#0F1B2D' }}
              >
                {record.type === 'income' ? '+' : ''}{record.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}