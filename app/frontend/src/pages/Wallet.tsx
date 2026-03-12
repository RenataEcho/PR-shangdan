import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet as WalletIcon } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { walletInfo } from '@/lib/mockData';
import { toast } from 'sonner';

export default function Wallet() {
  const handleWithdraw = () => {
    toast.info('提现功能开发中，敬请期待');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      {/* Header with Balance */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] pt-12 pb-8 px-4">
        <h1 className="text-white text-xl font-bold mb-5">我的钱包</h1>
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5">
          <p className="text-white/70 text-xs mb-1">账户余额 (元)</p>
          <p className="text-white text-3xl font-bold mb-4">
            ¥ {walletInfo.balance.toFixed(2)}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-white/60 text-[10px]">待结算</p>
              <p className="text-white text-sm font-semibold">¥ {walletInfo.pendingAmount.toFixed(2)}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex-1">
              <p className="text-white/60 text-[10px]">累计收入</p>
              <p className="text-white text-sm font-semibold">¥ {walletInfo.totalEarned.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleWithdraw}
          className="w-full mt-4 py-3 bg-white rounded-full text-[#FF6B35] font-semibold text-sm active:scale-[0.98] transition-transform shadow-lg"
        >
          提现
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-2 grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{walletInfo.records.filter(r => r.type === 'income').length}</p>
          <p className="text-[10px] text-gray-400">收入笔数</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <ArrowUpCircle className="w-5 h-5 text-[#FF6B35] mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{walletInfo.records.filter(r => r.type === 'withdraw').length}</p>
          <p className="text-[10px] text-gray-400">提现笔数</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <WalletIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">
            ¥{(walletInfo.totalEarned - walletInfo.balance - walletInfo.pendingAmount).toFixed(0)}
          </p>
          <p className="text-[10px] text-gray-400">已提现</p>
        </div>
      </div>

      {/* Transaction Records */}
      <div className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">收支明细</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {walletInfo.records.map((record, i) => (
            <div
              key={record.id}
              className={`flex items-center justify-between px-4 py-3.5 ${
                i < walletInfo.records.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    record.type === 'income' ? 'bg-emerald-50' : 'bg-orange-50'
                  }`}
                >
                  {record.type === 'income' ? (
                    <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowUpCircle className="w-4 h-4 text-[#FF6B35]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{record.title}</p>
                  <p className="text-[10px] text-gray-400">{record.date} · {record.status}</p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  record.type === 'income' ? 'text-emerald-600' : 'text-gray-500'
                }`}
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