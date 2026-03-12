import { ArrowLeft, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { walletInfo } from '@/lib/mockData';

export default function WalletRecords() {
  const navigate = useNavigate();

  const incomeRecords = walletInfo.records.filter(r => r.type === 'income');
  const withdrawRecords = walletInfo.records.filter(r => r.type === 'withdraw');
  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalWithdraw = withdrawRecords.reduce((sum, r) => sum + Math.abs(r.amount), 0);

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/wallet')}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white text-lg font-bold">收支明细</h1>
        </div>

        {/* Summary */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p className="text-white/50 text-[10px] mb-0.5">总收入</p>
            <p className="text-[#16C784] text-lg font-bold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              +¥{totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p className="text-white/50 text-[10px] mb-0.5">总提现</p>
            <p className="text-white text-lg font-bold" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              -¥{totalWithdraw.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          {walletInfo.records.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">暂无收支记录</p>
            </div>
          ) : (
            walletInfo.records.map((record, i) => (
              <div
                key={record.id}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i < walletInfo.records.length - 1 ? 'border-b border-[#E6EAF2]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      record.type === 'income' ? 'bg-[#16C784]/10' : 'bg-[#2F6BFF]/10'
                    }`}
                  >
                    {record.type === 'income' ? (
                      <ArrowDownCircle className="w-4.5 h-4.5 text-[#16C784]" />
                    ) : (
                      <ArrowUpCircle className="w-4.5 h-4.5 text-[#2F6BFF]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F1B2D]">{record.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{record.date} · {record.status}</p>
                  </div>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: '"DIN Alternate", "DIN", system-ui',
                    color: record.type === 'income' ? '#16C784' : '#0F1B2D',
                  }}
                >
                  {record.type === 'income' ? '+' : ''}{record.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}