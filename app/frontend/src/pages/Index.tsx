import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import OrderCard from '@/components/OrderCard';
import { orders, categories } from '@/lib/mockData';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesCategory = activeCategory === '全部' || order.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] pt-12 pb-5 px-4">
        <h1 className="text-white text-xl font-bold mb-3">商单大厅</h1>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索商单标题或ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center gap-1 px-4 py-2.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#FF6B35] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Order Feed */}
      <div className="px-4 pt-3 space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">暂无匹配的商单</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}