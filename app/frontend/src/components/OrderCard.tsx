import { useNavigate } from 'react-router-dom';
import type { Order } from '@/lib/mockData';

interface OrderCardProps {
  order: Order;
}

const tagColorMap: Record<string, string> = {
  'VIP任务': 'bg-amber-500/10 text-amber-600 border border-amber-200',
  '高佣任务': 'bg-[#16C784]/10 text-[#16C784] border border-[#16C784]/20',
  '官方任务': 'bg-[#2F6BFF]/10 text-[#2F6BFF] border border-[#2F6BFF]/20',
  'CPA': 'bg-purple-500/10 text-purple-600 border border-purple-200',
};

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const renderPrice = () => {
    switch (order.priceType) {
      case 'fixed':
        return <span className="text-[#16C784] font-bold text-xl" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>{order.priceFixed}</span>;
      case 'range':
        return (
          <span className="text-[#16C784] font-bold text-xl" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
            ¥{order.priceMin} - {order.priceMax}
          </span>
        );
      case 'negotiable':
        return <span className="text-gray-500 font-medium text-sm">{order.priceLabel || '面议'}</span>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => navigate(`/order/${order.id}`)}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
      style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <img
            src={order.coverImage}
            alt={order.title}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-[#0F1B2D] line-clamp-1 mb-1.5">
              {order.title}
            </h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {order.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tagColorMap[tag] || 'bg-gray-100 text-gray-500'}`}
                >
                  {tag}
                </span>
              ))}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0F1B2D]/5 text-[#0F1B2D]/60">
                {order.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
              {order.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E6EAF2]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">佣金</span>
            {renderPrice()}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              order.statusColor === 'green' ? 'bg-[#16C784]/10 text-[#16C784]' : 'bg-amber-50 text-amber-600'
            }`}>
              {order.statusTag}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/order/${order.id}`);
              }}
              className="px-3 py-1.5 bg-[#2F6BFF] text-white text-xs font-medium rounded-lg active:scale-95 transition-transform"
            >
              立即报名
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}