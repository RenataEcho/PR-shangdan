import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>商单不存在</p>
          <button onClick={() => navigate('/')} className="mt-3 text-[#FF6B35] text-sm font-medium">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setEnrolled(true);
    toast.success('报名成功！请前往任务中心查看', {
      duration: 2000,
    });
  };

  const renderPrice = () => {
    switch (order.priceType) {
      case 'fixed':
        return order.priceFixed;
      case 'range':
        return `¥ ${order.priceMin} - ${order.priceMax}`;
      case 'negotiable':
        return order.priceLabel || '面议';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      {/* Cover Image */}
      <div className="relative">
        <img src={order.coverImage} alt={order.title} className="w-full h-52 object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F5F5F7] to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 -mt-4 relative z-10 space-y-3">
        {/* Title Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-lg font-bold text-gray-900 flex-1 mr-2">{order.title}</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35] whitespace-nowrap">
              {order.category}
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{order.detailDescription}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-[#FF6B35]">
              <DollarSign className="w-4 h-4" />
              <span className="font-bold">{renderPrice()}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">ID: {order.id}</span>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
            具体要求
          </h2>
          <ul className="space-y-2">
            {order.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-1.5 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Settlement Rules */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#FF6B35]" />
            结算规则
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{order.settlementRules}</p>
        </div>

        {/* Threshold */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FF6B35]" />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom z-50">
        <button
          onClick={handleEnroll}
          disabled={enrolled}
          className={`w-full py-3.5 rounded-full text-base font-semibold transition-all ${
            enrolled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white active:scale-[0.98] shadow-lg shadow-orange-200'
          }`}
        >
          {enrolled ? '已报名' : '立即报名'}
        </button>
      </div>
    </div>
  );
}