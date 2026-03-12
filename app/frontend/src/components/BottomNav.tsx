import { Home, ClipboardList, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/tasks', label: '任务中心', icon: ClipboardList },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div className="bg-[#0F1B2D] border-t border-[#1D3557]/50">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all"
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-[#2F6BFF]' : 'text-gray-500'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    active ? 'text-[#2F6BFF]' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <div className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#2F6BFF]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}