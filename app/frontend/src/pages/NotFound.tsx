import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl font-bold text-gray-200 mb-2">404</div>
      <p className="text-gray-500 text-sm mb-6">页面不存在或已被移除</p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B35] text-white rounded-full text-sm font-medium active:scale-95 transition-transform"
      >
        <Home className="w-4 h-4" />
        返回首页
      </button>
    </div>
  );
}