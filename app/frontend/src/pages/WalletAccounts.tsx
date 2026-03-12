import { useState } from 'react';
import { ArrowLeft, CreditCard, Building2, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface BoundAccount {
  type: 'alipay' | 'bank';
  name: string;
  account: string;
}

export default function WalletAccounts() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [accounts, setAccounts] = useState<BoundAccount[]>([
    { type: 'alipay', name: '支付宝', account: '138****8888' },
  ]);
  const [newAccountType, setNewAccountType] = useState<'alipay' | 'bank'>('bank');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');

  const handleAddAccount = () => {
    if (!newAccountNumber.trim()) {
      toast.error('请填写账户信息');
      return;
    }
    if (newAccountType === 'bank' && !newAccountName.trim()) {
      toast.error('请填写开户银行');
      return;
    }
    const masked =
      newAccountNumber.length > 4
        ? newAccountNumber.slice(0, 3) + '****' + newAccountNumber.slice(-4)
        : newAccountNumber;
    setAccounts([
      ...accounts,
      {
        type: newAccountType,
        name: newAccountType === 'alipay' ? '支付宝' : newAccountName,
        account: masked,
      },
    ]);
    setNewAccountName('');
    setNewAccountNumber('');
    setShowAddForm(false);
    toast.success('账户添加成功');
  };

  const handleRemoveAccount = (index: number) => {
    setAccounts(accounts.filter((_, i) => i !== index));
    toast.success('账户已移除');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/wallet')}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white text-lg font-bold">收款帐户</h1>
        </div>
      </div>

      {/* Account List */}
      <div className="px-4 py-4 space-y-3">
        {accounts.map((acc, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
          >
            {acc.type === 'alipay' ? (
              <div className="w-11 h-11 rounded-xl bg-[#1677FF]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#1677FF]" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0F1B2D]">{acc.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{acc.account}</p>
            </div>
            <button
              onClick={() => handleRemoveAccount(i)}
              className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        ))}

        {/* Add Account Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
          >
            <Plus className="w-5 h-5 text-[#2F6BFF]" />
            <span className="text-sm font-semibold text-[#2F6BFF]">添加新帐户</span>
          </button>
        )}
      </div>

      {/* Add Account Form (Bottom Sheet) */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowAddForm(false)}>
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
              style={{
                background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)',
                boxShadow: '0 4px 16px rgba(47,107,255,0.3)',
              }}
            >
              确认添加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}