import { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet as WalletIcon, Plus, CreditCard, Building2, ChevronRight } from 'lucide-react';
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

interface BoundAccount {
  type: 'alipay' | 'bank';
  name: string;
  account: string;
}

export default function Wallet() {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accounts, setAccounts] = useState<BoundAccount[]>([
    { type: 'alipay', name: '支付宝', account: '138****8888' },
  ]);
  const [newAccountType, setNewAccountType] = useState<'alipay' | 'bank'>('bank');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');

  const handleWithdraw = () => {
    toast.info('提现功能开发中，敬请期待');
  };

  const handleAddAccount = () => {
    if (!newAccountName.trim() || !newAccountNumber.trim()) {
      toast.error('请填写完整的账户信息');
      return;
    }
    const masked = newAccountNumber.length > 4
      ? newAccountNumber.slice(0, 3) + '****' + newAccountNumber.slice(-4)
      : newAccountNumber;
    setAccounts([...accounts, {
      type: newAccountType,
      name: newAccountType === 'alipay' ? '支付宝' : newAccountName,
      account: masked,
    }]);
    setNewAccountName('');
    setNewAccountNumber('');
    setShowAccountModal(false);
    toast.success('账户添加成功');
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

      {/* Add Account Entry */}
      <div className="px-4 -mt-3 relative z-10 mb-3">
        <div
          className="bg-white rounded-2xl p-4 cursor-pointer active:scale-[0.99] transition-transform"
          style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
          onClick={() => setShowAccountModal(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#2F6BFF]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F1B2D]">添加帐户</p>
                <p className="text-[10px] text-gray-400">绑定收款账户，快速提现</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          {/* Bound accounts preview */}
          {accounts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#E6EAF2] space-y-2">
              {accounts.map((acc, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {acc.type === 'alipay' ? (
                    <div className="w-6 h-6 rounded bg-[#1677FF]/10 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-[#1677FF]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  )}
                  <span className="text-xs text-gray-600">{acc.name}</span>
                  <span className="text-[10px] text-gray-400 ml-auto">{acc.account}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today Earnings */}
      <div className="px-4 relative z-10">
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

      {/* Add Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowAccountModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full bg-white rounded-t-3xl p-5 pb-8 animate-in slide-in-from-bottom duration-300"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0F1B2D] mb-4">添加收款帐户</h3>

            {/* Account Type Selection */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setNewAccountType('alipay')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  newAccountType === 'alipay'
                    ? 'border-[#2F6BFF] bg-[#2F6BFF]/5 text-[#2F6BFF]'
                    : 'border-[#E6EAF2] text-gray-500'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1" />
                支付宝
              </button>
              <button
                onClick={() => setNewAccountType('bank')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  newAccountType === 'bank'
                    ? 'border-[#2F6BFF] bg-[#2F6BFF]/5 text-[#2F6BFF]'
                    : 'border-[#E6EAF2] text-gray-500'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1" />
                银行卡
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {newAccountType === 'bank' && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">开户银行</label>
                  <input
                    type="text"
                    placeholder="请输入开户银行名称"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F8FF] rounded-xl text-sm text-[#0F1B2D] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  {newAccountType === 'alipay' ? '支付宝账号' : '银行卡号'}
                </label>
                <input
                  type="text"
                  placeholder={newAccountType === 'alipay' ? '请输入支付宝账号' : '请输入银行卡号'}
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F8FF] rounded-xl text-sm text-[#0F1B2D] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddAccount}
              className="w-full mt-5 py-3.5 rounded-xl text-sm font-semibold text-white active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.3)' }}
            >
              确认添加
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}