import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Smartphone,
  Building2,
  Info,
  ShieldCheck,
  Check,
  X,
  Lock,
  Delete,
} from 'lucide-react';
import { walletInfo } from '@/lib/mockData';
import { toast } from 'sonner';

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
const CORRECT_PASSWORD = '123456';
const MAX_ATTEMPTS = 5;

function calcFee(amount: number) {
  const fee = Math.max(amount * FEE_RATE, MIN_FEE);
  return Math.round(fee * 100) / 100;
}

const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'] as const;

export default function Withdraw() {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<Account>(accounts[0]);
  const [amountStr, setAmountStr] = useState('');
  const [error, setError] = useState('');
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password state
  const [password, setPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [locked, setLocked] = useState(false);
  const [verified, setVerified] = useState(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const balance = walletInfo.balance;
  const amount = parseFloat(amountStr) || 0;
  const fee = calcFee(amount);
  const actualAmount = Math.round((amount - fee) * 100) / 100;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAccountPicker(false);
        if (!verified) {
          setShowConfirmSheet(false);
          setPassword('');
          setPwdError('');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [verified]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  const handleAmountChange = (val: string) => {
    setError('');
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
    setPassword('');
    setPwdError('');
    setVerified(false);
    setShowConfirmSheet(true);
  };

  const handlePasswordInput = useCallback((key: string) => {
    if (locked || verified) return;
    setPwdError('');

    if (key === 'delete') {
      setPassword((prev) => prev.slice(0, -1));
      return;
    }

    setPassword((prev) => {
      if (prev.length >= 6) return prev;
      const newPwd = prev + key;

      if (newPwd.length === 6) {
        setTimeout(() => {
          if (newPwd === CORRECT_PASSWORD) {
            setVerified(true);
            setPwdError('');
          } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setShaking(true);
            setTimeout(() => setShaking(false), 500);

            if (newAttempts >= MAX_ATTEMPTS) {
              setLocked(true);
              setPwdError('错误次数过多，请30秒后重试');
              lockTimerRef.current = setTimeout(() => {
                setLocked(false);
                setAttempts(0);
                setPwdError('');
              }, 30000);
            } else {
              setPwdError(`密码错误，还可尝试 ${MAX_ATTEMPTS - newAttempts} 次`);
            }
            setPassword('');
          }
        }, 150);
      }

      return newPwd;
    });
  }, [locked, verified, attempts]);

  const handleConfirmWithdraw = () => {
    setShowConfirmSheet(false);
    setShowSuccess(true);
  };

  const handleCloseSheet = () => {
    setShowConfirmSheet(false);
    setPassword('');
    setPwdError('');
    setVerified(false);
  };

  const handleForgotPassword = () => {
    toast.info('请联系客服重置支付密码', {
      description: '客服热线：400-888-8888',
    });
  };

  // Success page
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col items-center justify-center px-6">
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
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-white font-bold text-base">输入提现金额</h1>
      </div>

      {/* Main Input Page */}
      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* Account Selector */}
        <button
          onClick={() => setShowAccountPicker(true)}
          className="w-full bg-white rounded-2xl p-4 flex items-center justify-between active:bg-gray-50 transition-colors"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${selectedAccount.bgColor} flex items-center justify-center`}>
              <selectedAccount.icon className={`w-5 h-5 ${selectedAccount.color}`} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#0F1B2D]">{selectedAccount.name}</p>
              <p className="text-xs text-gray-400">{selectedAccount.account}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {/* Amount Input Card */}
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
            <p className="text-[10px] text-gray-400">可用余额 ¥{balance.toFixed(2)}</p>
            {amount > 0 && (
              <p className="text-[10px] text-gray-400">手续费 ¥{fee.toFixed(2)}</p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 mt-3 text-red-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <p className="text-xs">{error}</p>
            </div>
          )}

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

      {/* Account Picker Overlay */}
      {showAccountPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAccountPicker(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 pb-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0F1B2D]">选择提现账户</h3>
              <button
                onClick={() => setShowAccountPicker(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2.5">
              {accounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = acc.id === selectedAccount.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setShowAccountPicker(false);
                    }}
                    className={`w-full rounded-2xl p-4 flex items-center justify-between transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#2F6BFF]/5 border-2 border-[#2F6BFF]'
                        : 'bg-[#F5F8FF] border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${acc.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${acc.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#0F1B2D]">{acc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{acc.account}</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">
                          {acc.type === 'alipay' ? '即时到账' : '1-3个工作日到账'}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#2F6BFF] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-start gap-2 px-1">
              <Info className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
              <p className="text-[10px] text-gray-400">如需添加新账户，请前往「收款帐户」页面管理</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm + Password Sheet Overlay */}
      {showConfirmSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseSheet} />
          <div className="relative w-full bg-white rounded-t-3xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
              <h3 className="text-base font-bold text-[#0F1B2D]">确认提现</h3>
              <button
                onClick={handleCloseSheet}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-2">
              {/* Amount Display */}
              <div className="text-center py-3">
                <p className="text-xs text-gray-400 mb-1">提现金额</p>
                <p className="text-3xl font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                  ¥ {amount.toFixed(2)}
                </p>
              </div>

              {/* Confirm Details */}
              <div className="bg-[#F5F8FF] rounded-2xl p-4 space-y-2.5 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">提现账户</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded ${selectedAccount.bgColor} flex items-center justify-center`}>
                      <selectedAccount.icon className={`w-2.5 h-2.5 ${selectedAccount.color}`} />
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
                  <span className="text-xs text-gray-400">到账时间</span>
                  <span className="text-xs font-medium text-[#0F1B2D]">
                    {selectedAccount.type === 'alipay' ? '即时到账' : '1-3个工作日'}
                  </span>
                </div>
                {verified && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">身份验证</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16C784]" />
                      <span className="text-xs font-medium text-[#16C784]">已验证</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Section */}
              {!verified ? (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-[#2F6BFF]" />
                    <p className="text-sm font-semibold text-[#0F1B2D]">请输入支付密码</p>
                  </div>

                  {/* Password Dots */}
                  <div className={`flex items-center justify-center gap-2.5 mb-3 ${shaking ? 'animate-shake' : ''}`}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                          i < password.length
                            ? 'border-[#2F6BFF] bg-[#2F6BFF]/5'
                            : i === password.length
                              ? 'border-[#2F6BFF]/40 bg-white'
                              : 'border-[#E6EAF2] bg-white'
                        }`}
                      >
                        {i < password.length && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0F1B2D]" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Error / Forgot */}
                  <div className="flex items-center justify-between h-5 mb-1">
                    <div className="flex items-center gap-1">
                      {pwdError && (
                        <>
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <p className="text-[11px] text-red-500">{pwdError}</p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={handleForgotPassword}
                      className="text-[11px] text-[#2F6BFF] font-medium active:opacity-70"
                    >
                      忘记密码？
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F0F7FF] rounded-2xl p-3.5 flex gap-3 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#2F6BFF] mt-0.5 shrink-0" />
                  <div className="text-xs text-[#2F6BFF]/80 space-y-0.5">
                    <p className="font-medium text-[#2F6BFF]">验证通过</p>
                    <p>支付密码已验证，点击下方按钮完成提现</p>
                  </div>
                </div>
              )}
            </div>

            {/* Number Pad or Confirm Button */}
            {!verified ? (
              <div className="bg-[#E8ECF2] p-1.5 pb-6 shrink-0">
                <div className="grid grid-cols-3 gap-1.5">
                  {numpadKeys.map((key, idx) => {
                    if (key === '') {
                      return <div key={idx} className="h-12" />;
                    }
                    if (key === 'delete') {
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePasswordInput('delete')}
                          disabled={locked}
                          className="h-12 rounded-xl bg-[#D1D5DB] flex items-center justify-center active:bg-[#B8BCC4] transition-colors disabled:opacity-40"
                        >
                          <Delete className="w-5 h-5 text-[#0F1B2D]" />
                        </button>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePasswordInput(key)}
                        disabled={locked}
                        className="h-12 rounded-xl bg-white flex items-center justify-center active:bg-gray-100 transition-colors disabled:opacity-40"
                        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                      >
                        <span className="text-lg font-semibold text-[#0F1B2D]">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-5 pb-6 pt-2 shrink-0">
                <button
                  onClick={handleConfirmWithdraw}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white active:scale-[0.98] transition-transform"
                  style={{ background: '#16C784', boxShadow: '0 4px 16px rgba(22,199,132,0.3)' }}
                >
                  确认提现 ¥{amount.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}