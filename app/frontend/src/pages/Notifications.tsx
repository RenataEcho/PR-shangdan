import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCheck, Megaphone, Gift, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'system' | 'task' | 'reward' | 'alert';
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 'N001',
    title: '任务审核通过',
    content: '您提交的「抖音短视频推广 - 记账App」视频已通过审核，佣金将在7个工作日内结算到您的钱包。',
    time: '2026-03-13 10:30',
    type: 'task',
    read: false,
  },
  {
    id: 'N002',
    title: '新任务推荐',
    content: '根据您的创作领域，为您推荐新任务「健身App推广 - 每日打卡」，佣金¥80-300，快来报名吧！',
    time: '2026-03-13 09:15',
    type: 'system',
    read: false,
  },
  {
    id: 'N003',
    title: '提现成功通知',
    content: '您申请的¥500.00提现已成功到账支付宝账户（尾号8888），请注意查收。',
    time: '2026-03-12 16:45',
    type: 'reward',
    read: false,
  },
  {
    id: 'N004',
    title: '账号安全提醒',
    content: '检测到您的账号在新设备上登录，如非本人操作，请及时修改密码。登录IP：北京市海淀区。',
    time: '2026-03-12 08:20',
    type: 'alert',
    read: true,
  },
  {
    id: 'N005',
    title: '平台活动通知',
    content: '🎉 春季创作者激励计划开启！3月15日-4月15日期间，完成任务可获得双倍积分奖励。',
    time: '2026-03-11 14:00',
    type: 'system',
    read: true,
  },
  {
    id: 'N006',
    title: '文案审核反馈',
    content: '您提交的「电视剧《星河之约》宣传推广」文案需要修改，请查看审核意见并重新提交。',
    time: '2026-03-11 11:30',
    type: 'task',
    read: true,
  },
  {
    id: 'N007',
    title: '系统维护通知',
    content: '平台将于3月14日凌晨2:00-4:00进行系统升级维护，届时部分功能可能暂时不可用，请提前做好安排。',
    time: '2026-03-10 18:00',
    type: 'system',
    read: true,
  },
];

const typeConfig = {
  system: { icon: Megaphone, color: '#2F6BFF', bgColor: 'bg-[#2F6BFF]/10' },
  task: { icon: Bell, color: '#16C784', bgColor: 'bg-[#16C784]/10' },
  reward: { icon: Gift, color: '#FF6B35', bgColor: 'bg-[#FF6B35]/10' },
  alert: { icon: AlertCircle, color: '#EF4444', bgColor: 'bg-red-50' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('已全部标记为已读');
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('已删除');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      <div
        className="sticky top-0 z-30"
        style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #162D50 100%)' }}
      >
        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-base font-bold">消息通知</h1>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="px-4 py-3 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">暂无消息通知</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                onClick={() => markRead(notification.id)}
                className={`relative bg-white rounded-2xl p-4 transition-all active:scale-[0.99] ${
                  !notification.read ? 'ring-1 ring-[#2F6BFF]/20' : ''
                }`}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                {/* Unread dot */}
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500" />
                )}

                <div className="flex gap-3">
                  <div className={`shrink-0 w-9 h-9 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                    <Icon style={{ color: config.color, width: 16, height: 16 }} />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className={`text-sm font-semibold mb-1 ${!notification.read ? 'text-[#0F1B2D]' : 'text-gray-600'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{notification.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-300">{notification.time}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 rounded-lg active:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}