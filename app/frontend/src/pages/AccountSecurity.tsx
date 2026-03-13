import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, KeyRound, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';

type PasswordType = 'login' | 'withdraw' | null;

export default function AccountSecurity() {
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState<PasswordType>(null);
  const [hasLoginPwd, setHasLoginPwd] = useState(true);
  const [hasWithdrawPwd, setHasWithdrawPwd] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleSubmit = () => {
    if (activeSheet === 'login' && hasLoginPwd && !oldPassword) {
      toast.error('请输入原密码');
      return;
    }
    if (!newPassword) {
      toast.error('请输入新密码');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('密码长度不能少于6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (activeSheet === 'login') {
      setHasLoginPwd(true);
      toast.success('登录密码设置成功');
    } else {
      setHasWithdrawPwd(true);
      toast.success('提现密码设置成功');
    }
    resetForm();
    setActiveSheet(null);
  };

  const securityItems = [
    {
      icon: Lock,
      label: '登录密码',
      desc: hasLoginPwd ? '已设置' : '未设置',
      descColor: hasLoginPwd ? 'text-[#16C784]' : 'text-red-400',
      color: '#2F6BFF',
      bgColor: 'bg-[#2F6BFF]/10',
      action: () => { resetForm(); setActiveSheet('login'); },
    },
    {
      icon: KeyRound,
      label: '提现密码',
      desc: hasWithdrawPwd ? '已设置' : '未设置，建议设置以保护资金安全',
      descColor: hasWithdrawPwd ? 'text-[#16C784]' : 'text-orange-400',
      color: '#FF6B35',
      bgColor: 'bg-[#FF6B35]/10',
      action: () => { resetForm(); setActiveSheet('withdraw'); },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      <div
        className="sticky top-0 z-30"
        style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #162D50 100%)' }}
      >
        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white text-base font-bold">账号安全</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Security Status */}
      <div className="px-4 py-4">
        <div
          className="bg-white rounded-2xl p-4 flex items-center gap-3"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16C784] to-[#10B981] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#0F1B2D]">安全等级</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: hasLoginPwd && hasWithdrawPwd ? '100%' : hasLoginPwd ? '60%' : '30%',
                    background: hasLoginPwd && hasWithdrawPwd
                      ? 'linear-gradient(90deg, #16C784, #10B981)'
                      : hasLoginPwd
                        ? 'linear-gradient(90deg, #FF6B35, #FFA500)'
                        : 'linear-gradient(90deg, #EF4444, #F87171)',
                  }}
                />
              </div>
              <span className={`text-[10px] font-medium ${
                hasLoginPwd && hasWithdrawPwd ? 'text-[#16C784]' : hasLoginPwd ? 'text-orange-400' : 'text-red-400'
              }`}>
                {hasLoginPwd && hasWithdrawPwd ? '安全' : hasLoginPwd ? '中等' : '较低'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Items */}
      <div className="px-4">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {securityItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-4 py-4 text-left active:bg-[#F5F8FF] transition-colors ${
                  i < securityItems.length - 1 ? 'border-b border-[#F0F2F5]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                    <Icon style={{ color: item.color, width: 18, height: 18 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F1B2D]">{item.label}</p>
                    <p className={`text-[11px] mt-0.5 ${item.descColor}`}>{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-[#2F6BFF] font-medium">
                  {(item.label === '登录密码' && hasLoginPwd) || (item.label === '提现密码' && hasWithdrawPwd) ? '修改' : '设置'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 mt-4">
        <div className="bg-[#FFF8F0] rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
          <h4 className="text-xs font-semibold text-orange-600 mb-2">🔒 安全提示</h4>
          <ul className="space-y-1.5">
            <li className="text-[11px] text-orange-500/80 flex items-start gap-1.5">
              <span className="mt-1 w-1 h-1 rounded-full bg-orange-400 shrink-0" />
              建议定期更换密码，提高账号安全性
            </li>
            <li className="text-[11px] text-orange-500/80 flex items-start gap-1.5">
              <span className="mt-1 w-1 h-1 rounded-full bg-orange-400 shrink-0" />
              登录密码和提现密码请勿设置相同
            </li>
            <li className="text-[11px] text-orange-500/80 flex items-start gap-1.5">
              <span className="mt-1 w-1 h-1 rounded-full bg-orange-400 shrink-0" />
              密码应包含字母和数字，长度不少于6位
            </li>
          </ul>
        </div>
      </div>

      {/* Password Sheet */}
      {activeSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { resetForm(); setActiveSheet(null); }} />
          <div
            className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-8 animate-in slide-in-from-bottom duration-300"
            style={{ maxWidth: '480px' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[#0F1B2D]">
                {activeSheet === 'login' ? (hasLoginPwd ? '修改登录密码' : '设置登录密码') : (hasWithdrawPwd ? '修改提现密码' : '设置提现密码')}
              </h3>
              <button
                onClick={() => { resetForm(); setActiveSheet(null); }}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Old password (only if already set) */}
              {((activeSheet === 'login' && hasLoginPwd) || (activeSheet === 'withdraw' && hasWithdrawPwd)) && (
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">原密码</label>
                  <div className="relative">
                    <input
                      type={showOld ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="请输入原密码"
                      className="w-full h-11 px-4 pr-10 rounded-xl bg-[#F5F8FF] border border-[#E8ECF4] text-sm text-[#0F1B2D] placeholder:text-gray-300 focus:outline-none focus:border-[#2F6BFF] focus:ring-1 focus:ring-[#2F6BFF]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showOld ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              )}

              {/* New password */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">新密码</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码（至少6位）"
                    className="w-full h-11 px-4 pr-10 rounded-xl bg-[#F5F8FF] border border-[#E8ECF4] text-sm text-[#0F1B2D] placeholder:text-gray-300 focus:outline-none focus:border-[#2F6BFF] focus:ring-1 focus:ring-[#2F6BFF]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNew ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">确认密码</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入新密码"
                    className="w-full h-11 px-4 pr-10 rounded-xl bg-[#F5F8FF] border border-[#E8ECF4] text-sm text-[#0F1B2D] placeholder:text-gray-300 focus:outline-none focus:border-[#2F6BFF] focus:ring-1 focus:ring-[#2F6BFF]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white active:scale-[0.97] transition-transform"
              style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.3)' }}
            >
              确认{activeSheet === 'login' ? (hasLoginPwd ? '修改' : '设置') : (hasWithdrawPwd ? '修改' : '设置')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}