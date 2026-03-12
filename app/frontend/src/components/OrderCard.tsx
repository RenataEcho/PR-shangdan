import { useNavigate } from 'react-router-dom';
import type { Order } from '@/lib/mockData';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const renderPrice = () => {
    switch (order.priceType) {
      case 'fixed':
        return <span className="text-[#FF6B35] font-bold text-lg">{order.priceFixed}</span>;
      case 'range':
        return (
          <span className="text-[#FF6B35] font-bold text-lg">
            ¥ {order.priceMin} - {order.priceMax}
          </span>
        );
      case 'negotiable':
        return <span className="text-gray-500 font-medium text-sm">{order.priceLabel || '面议'}</span>;
      default:
        return null;
    }
  };

  const statusColorMap = {
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div
      onClick={() => navigate(`/order/${order.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-50 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="relative">
        <img
          src={order.coverImage}
          alt={order.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColorMap[order.statusColor]}`}
          >
            {order.statusTag}
          </span>
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-white backdrop-blur-sm">
            {order.category}
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1 mb-1">
          {order.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2.5 leading-relaxed">
          {order.description}
        </p>
        <div className="flex items-center justify-between">
          {renderPrice()}
          <span className="text-[10px] text-gray-400">ID: {order.id}</span>
        </div>
      </div>
    </div>
  );
}