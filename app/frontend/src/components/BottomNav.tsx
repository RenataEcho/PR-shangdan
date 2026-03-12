import { Home, ClipboardList, Wallet, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/tasks', label: '任务中心', icon: ClipboardList },
  { path: '/wallet', label: '钱包', icon: Wallet },
  { path: '/profile', label: '我的', icon: User },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  active ? 'text-[#FF6B35]' : 'text-gray-400'
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-[#FF6B35]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}