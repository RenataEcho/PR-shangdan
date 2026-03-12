import {
  ChevronRight,
  Star,
  FileCheck,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  Bell,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { userProfile } from '@/lib/mockData';
import { toast } from 'sonner';

export default function Profile() {
  const menuItems = [
    { icon: FileCheck, label: '我的商单', desc: '查看已报名商单', color: 'text-[#FF6B35]', bgColor: 'bg-orange-50' },
    { icon: Star, label: '我的收藏', desc: '收藏的商单', color: 'text-amber-500', bgColor: 'bg-amber-50' },
    { icon: Bell, label: '消息通知', desc: '系统消息和通知', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { icon: Shield, label: '账号安全', desc: '密码和绑定设置', color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { icon: HelpCircle, label: '帮助中心', desc: '常见问题解答', color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { icon: Settings, label: '设置', desc: '通用设置', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] pt-12 pb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
            {userProfile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-white text-lg font-bold">{userProfile.name}</h1>
            <p className="text-white/70 text-xs mt-0.5">抖音号: {userProfile.douyinId}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white">
                {userProfile.level}
              </span>
              <span className="text-white/60 text-[10px]">
                粉丝 {(userProfile.followers / 10000).toFixed(1)}万
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{userProfile.completedOrders}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">已完成商单</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-xl font-bold text-[#FF6B35]">¥{userProfile.totalEarnings}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">累计收益</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{userProfile.followers.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">粉丝数</p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => toast.info(`${item.label}功能开发中`)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-gray-50 transition-colors ${
                  i < menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button
          onClick={() => toast.info('退出登录功能开发中')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm text-red-500 text-sm font-medium active:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>

      <BottomNav />
    </div>
  );
}