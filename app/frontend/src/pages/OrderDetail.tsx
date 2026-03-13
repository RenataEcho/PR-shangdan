import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, CheckCircle2, AlertCircle, ListChecks } from 'lucide-react';
import { orders } from '@/lib/mockData';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>任务不存在</p>
          <button onClick={() => navigate('/')} className="mt-3 text-[#2F6BFF] text-sm font-medium">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setEnrolled(true);
    toast.success('报名成功！请前往任务中心查看', { duration: 2000 });
  };

  const renderPrice = () => {
    switch (order.priceType) {
      case 'fixed':
        return order.priceFixed;
      case 'range':
        return `¥${order.priceMin} - ${order.priceMax}`;
      case 'negotiable':
        return order.priceLabel || '面议';
      default:
        return '';
    }
  };

  const tagColorMap: Record<string, string> = {
    'VIP任务': 'bg-amber-500/10 text-amber-600',
    '高佣任务': 'bg-[#16C784]/10 text-[#16C784]',
    '官方任务': 'bg-[#2F6BFF]/10 text-[#2F6BFF]',
    'CPA': 'bg-purple-500/10 text-purple-600',
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-24">
      {/* Cover Image */}
      <div className="relative">
        <img src={order.coverImage} alt={order.title} className="w-full h-52 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B2D]/60 via-transparent to-[#F5F8FF]" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-10 space-y-3">
        {/* Title Card */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {order.tags.map((tag) => (
              <span key={tag} className={`px-2 py-0.5 rounded text-[10px] font-medium ${tagColorMap[tag] || 'bg-gray-100 text-gray-500'}`}>
                {tag}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0F1B2D]/5 text-[#0F1B2D]/60">
              {order.category}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#0F1B2D] mb-2">{order.title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{order.detailDescription}</p>
          <div className="flex items-center gap-4 pt-3 border-t border-[#E6EAF2]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">佣金</span>
              <span className="text-[#16C784] font-bold text-2xl" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                {renderPrice()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">ID: {order.id}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-[#2F6BFF]" />
            完成步骤
          </h2>
          <div className="space-y-3">
            {order.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#2F6BFF]/10 flex items-center justify-center text-xs font-bold text-[#2F6BFF] flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" />
            具体要求
          </h2>
          <ul className="space-y-2">
            {order.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF] mt-1.5 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Settlement Rules */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <span className="text-[#16C784]">💰</span>
            审核规则
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{order.settlementRules}</p>
        </div>

        {/* Threshold */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2F6BFF]" />
            参与门槛
          </h2>
          <div className="space-y-2">
            {order.threshold.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E6EAF2] p-4 safe-area-bottom z-50" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <button
          onClick={handleEnroll}
          disabled={enrolled}
          className={`w-full py-3.5 rounded-xl text-base font-semibold transition-all ${
            enrolled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'text-white active:scale-[0.96]'
          }`}
          style={!enrolled ? { background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.3)' } : {}}
        >
          {enrolled ? '已报名' : '立即报名'}
        </button>
      </div>
    </div>
  );
}