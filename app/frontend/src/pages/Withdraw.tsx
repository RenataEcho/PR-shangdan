import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Smartphone,
  Building2,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { walletInfo } from '@/lib/mockData';

type Step = 'select' | 'amount' | 'confirm' | 'success';

interface Account {
  id: string;
  type: 'alipay' | 'bank';
  name: string;
  account: string;
  icon: typeof Smartphone;
  color: string;
  bgColor: string;
}

const accounts: Account[] = [
  {
    id: 'a1',
    type: 'alipay',
    name: '支付宝',
    account: '138****8888',
    icon: Smartphone,
    color: 'text-[#1677FF]',
    bgColor: 'bg-[#1677FF]/10',
  },
  {
    id: 'a2',
    type: 'bank',
    name: '中国工商银行',
    account: '****  ****  ****  6688',
    icon: Building2,
    color: 'text-[#E4393C]',
    bgColor: 'bg-[#E4393C]/10',
  },
];

const quickAmounts = [100, 200, 500, 1000];

const FEE_RATE = 0.006;
const MIN_WITHDRAW = 10;
const MAX_WITHDRAW_DAILY = 5000;
const MIN_FEE = 0.1;

function calcFee(amount: number) {
  const fee = Math.max(amount * FEE_RATE, MIN_FEE);
  return Math.round(fee * 100) / 100;
}

export default function Withdraw() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [error, setError] = useState('');

  const balance = walletInfo.balance;
  const amount = parseFloat(amountStr) || 0;
  const fee = calcFee(amount);
  const actualAmount = Math.round((amount - fee) * 100) / 100;

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setStep('amount');
  };

  const handleAmountChange = (val: string) => {
    setError('');
    // Only allow numbers and one decimal point with up to 2 decimal places
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmountStr(cleaned);
  };

  const handleQuickAmount = (val: number) => {
    setError('');
    if (val > balance) {
      setAmountStr(balance.toFixed(2));
    } else {
      setAmountStr(val.toString());
    }
  };

  const handleWithdrawAll = () => {
    setError('');
    setAmountStr(balance.toFixed(2));
  };

  const validateAndProceed = () => {
    const amt = parseFloat(amountStr);
    if (!amt || amt <= 0) {
      setError('请输入提现金额');
      return;
    }
    if (amt < MIN_WITHDRAW) {
      setError(`最低提现金额为 ¥${MIN_WITHDRAW}`);
      return;
    }
    if (amt > balance) {
      setError('提现金额不能超过可用余额');
      return;
    }
    if (amt > MAX_WITHDRAW_DAILY) {
      setError(`单日提现上限为 ¥${MAX_WITHDRAW_DAILY.toLocaleString()}`);
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('success');
  };

  const goBack = () => {
    if (step === 'amount') setStep('select');
    else if (step === 'confirm') setStep('amount');
    else navigate(-1);
  };

  const stepTitle: Record<Step, string> = {
    select: '选择提现账户',
    amount: '输入提现金额',
    confirm: '确认提现',
    success: '提现成功',
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      {step !== 'success' && (
        <div
          className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}
        >
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-bold text-base">{stepTitle[step]}</h1>
        </div>
      )}

      {/* Step: Select Account */}
      {step === 'select' && (
        <div className="px-4 pt-4 space-y-3">
          {/* Balance Info */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <p className="text-xs text-gray-400 mb-1">可提现余额</p>
            <p className="text-2xl font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              ¥ {balance.toFixed(2)}
            </p>
          </div>

          {/* Account List */}
          <div>
            <p className="text-xs text-gray-400 mb-2 px-1">请选择提现到以下账户</p>
            <div className="space-y-2.5">
              {accounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full bg-white rounded-2xl p-4 flex items-center justify-between active:scale-[0.99] transition-transform"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${acc.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${acc.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#0F1B2D]">{acc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{acc.account}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-2xl p-4 flex gap-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-700 space-y-1">
              <p className="font-medium">提现须知</p>
              <p>• 最低提现金额 ¥{MIN_WITHDRAW}，单日上限 ¥{MAX_WITHDRAW_DAILY.toLocaleString()}</p>
              <p>• 手续费率 {(FEE_RATE * 100).toFixed(1)}%，最低 ¥{MIN_FEE}</p>
              <p>• 提现到账时间：支付宝即时到账，银行卡1-3个工作日</p>
              <p>• 待结算金额不可提现，需等待结算完成</p>
            </div>
          </div>
        </div>
      )}

      {/* Step: Enter Amount */}
      {step === 'amount' && selectedAccount && (
        <div className="px-4 pt-4 space-y-4">
          {/* Selected Account */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <div className={`w-10 h-10 rounded-xl ${selectedAccount.bgColor} flex items-center justify-center`}>
              <selectedAccount.icon className={`w-5 h-5 ${selectedAccount.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1B2D]">{selectedAccount.name}</p>
              <p className="text-xs text-gray-400">{selectedAccount.account}</p>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">提现金额</p>
              <button onClick={handleWithdrawAll} className="text-xs text-[#2F6BFF] font-medium">
                全部提现
              </button>
            </div>
            <div className="flex items-baseline gap-1 border-b-2 border-[#E6EAF2] focus-within:border-[#2F6BFF] pb-2 transition-colors">
              <span className="text-2xl font-bold text-[#0F1B2D]">¥</span>
              <input
                type="text"
                inputMode="decimal"
                value={amountStr}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 text-3xl font-bold text-[#0F1B2D] bg-transparent outline-none placeholder:text-gray-200"
                style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-gray-400">
                可用余额 ¥{balance.toFixed(2)}
              </p>
              {amount > 0 && (
                <p className="text-[10px] text-gray-400">
                  手续费 ¥{fee.toFixed(2)}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-1.5 mt-3 text-red-500">
                <AlertCircle className="w-3.5 h-3.5" />
                <p className="text-xs">{error}</p>
              </div>
            )}

            {/* Quick Amounts */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuickAmount(val)}
                  disabled={val > balance}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    parseFloat(amountStr) === val
                      ? 'bg-[#2F6BFF] text-white'
                      : val > balance
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'bg-[#F5F8FF] text-[#0F1B2D] active:bg-[#2F6BFF]/10'
                  }`}
                >
                  ¥{val}
                </button>
              ))}
            </div>
          </div>

          {/* Fee Explanation */}
          <div className="bg-white rounded-2xl p-4 space-y-2.5" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-semibold text-[#0F1B2D]">费用说明</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">手续费率</span>
                <span className="text-[#0F1B2D] font-medium">{(FEE_RATE * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">最低手续费</span>
                <span className="text-[#0F1B2D] font-medium">¥{MIN_FEE}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">单日提现上限</span>
                <span className="text-[#0F1B2D] font-medium">¥{MAX_WITHDRAW_DAILY.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">最低提现金额</span>
                <span className="text-[#0F1B2D] font-medium">¥{MIN_WITHDRAW}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">到账时间</span>
                <span className="text-[#0F1B2D] font-medium">
                  {selectedAccount.type === 'alipay' ? '即时到账' : '1-3个工作日'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={validateAndProceed}
            disabled={!amountStr || parseFloat(amountStr) <= 0}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
              amountStr && parseFloat(amountStr) > 0
                ? 'text-white active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            style={
              amountStr && parseFloat(amountStr) > 0
                ? { background: '#16C784', boxShadow: '0 4px 16px rgba(22,199,132,0.3)' }
                : {}
            }
          >
            下一步
          </button>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && selectedAccount && (
        <div className="px-4 pt-4 space-y-4">
          {/* Confirm Card */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <div className="text-center mb-5">
              <p className="text-xs text-gray-400 mb-1">提现金额</p>
              <p className="text-4xl font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                ¥ {amount.toFixed(2)}
              </p>
            </div>

            <div className="space-y-3 border-t border-[#E6EAF2] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">提现账户</span>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md ${selectedAccount.bgColor} flex items-center justify-center`}>
                    <selectedAccount.icon className={`w-3 h-3 ${selectedAccount.color}`} />
                  </div>
                  <span className="text-xs font-medium text-[#0F1B2D]">
                    {selectedAccount.name} ({selectedAccount.account})
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">手续费</span>
                <span className="text-xs font-medium text-[#0F1B2D]">¥ {fee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">实际到账</span>
                <span className="text-sm font-bold text-[#16C784]">¥ {actualAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">预计到账时间</span>
                <span className="text-xs font-medium text-[#0F1B2D]">
                  {selectedAccount.type === 'alipay' ? '即时到账' : '1-3个工作日'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-[#F0F7FF] rounded-2xl p-4 flex gap-3">
            <ShieldCheck className="w-4 h-4 text-[#2F6BFF] mt-0.5 shrink-0" />
            <div className="text-xs text-[#2F6BFF]/80 space-y-0.5">
              <p className="font-medium text-[#2F6BFF]">安全提示</p>
              <p>请确认提现账户信息无误，提现发起后无法撤回</p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white active:scale-[0.98] transition-transform"
            style={{ background: '#16C784', boxShadow: '0 4px 16px rgba(22,199,132,0.3)' }}
          >
            确认提现
          </button>

          <button
            onClick={() => setStep('amount')}
            className="w-full py-3 rounded-xl font-medium text-sm text-gray-400 active:bg-gray-50 transition-colors"
          >
            返回修改
          </button>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && selectedAccount && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-full bg-[#16C784]/10 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-10 h-10 text-[#16C784]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F1B2D] mb-1">提现申请已提交</h2>
          <p className="text-sm text-gray-400 mb-6">
            {selectedAccount.type === 'alipay' ? '预计即时到账' : '预计1-3个工作日到账'}
          </p>

          <div className="w-full bg-white rounded-2xl p-5 space-y-3 mb-8" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">提现金额</span>
              <span className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                ¥ {amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">手续费</span>
              <span className="text-xs text-gray-500">¥ {fee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#E6EAF2] pt-3">
              <span className="text-xs text-gray-400">实际到账</span>
              <span className="text-base font-bold text-[#16C784]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                ¥ {actualAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">到账账户</span>
              <span className="text-xs text-[#0F1B2D]">{selectedAccount.name} {selectedAccount.account}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #1D3557 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.3)' }}
          >
            返回个人中心
          </button>
          <button
            onClick={() => navigate('/wallet/records')}
            className="w-full py-3 mt-2 rounded-xl font-medium text-sm text-[#2F6BFF] active:bg-[#2F6BFF]/5 transition-colors"
          >
            查看提现记录
          </button>
        </div>
      )}
    </div>
  );
}