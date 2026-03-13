import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Bell,
  Trash2,
  Info,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotification, setPushNotification] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleItems = [
    {
      icon: darkMode ? Moon : Sun,
      label: '深色模式',
      desc: darkMode ? '已开启' : '跟随系统',
      color: '#6C8CFF',
      bgColor: 'bg-[#6C8CFF]/10',
      value: darkMode,
      onChange: () => {
        setDarkMode(!darkMode);
        toast.info(darkMode ? '已关闭深色模式' : '深色模式已开启');
      },
    },
    {
      icon: Bell,
      label: '推送通知',
      desc: pushNotification ? '已开启' : '已关闭',
      color: '#2F6BFF',
      bgColor: 'bg-[#2F6BFF]/10',
      value: pushNotification,
      onChange: () => {
        setPushNotification(!pushNotification);
        toast.info(pushNotification ? '已关闭推送通知' : '推送通知已开启');
      },
    },
    {
      icon: Bell,
      label: '提示音',
      desc: soundEnabled ? '已开启' : '已关闭',
      color: '#16C784',
      bgColor: 'bg-[#16C784]/10',
      value: soundEnabled,
      onChange: () => {
        setSoundEnabled(!soundEnabled);
        toast.info(soundEnabled ? '已关闭提示音' : '提示音已开启');
      },
    },
  ];

  const actionItems = [
    {
      icon: Globe,
      label: '语言设置',
      desc: '简体中文',
      color: '#FF6B35',
      bgColor: 'bg-[#FF6B35]/10',
      action: () => toast.info('当前仅支持简体中文'),
    },
    {
      icon: Trash2,
      label: '清除缓存',
      desc: '释放存储空间',
      color: '#EF4444',
      bgColor: 'bg-red-50',
      action: () => toast.success('缓存已清除'),
    },
    {
      icon: Info,
      label: '关于我们',
      desc: '版本 1.0.0',
      color: '#8B5CF6',
      bgColor: 'bg-purple-50',
      action: () => toast.info('达人任务平台 v1.0.0'),
    },
  ];

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
          <h1 className="text-white text-base font-bold">设置</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Toggle Settings */}
      <div className="px-4 pt-4">
        <p className="text-[11px] text-gray-400 font-medium mb-2 px-1">偏好设置</p>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {toggleItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.onChange}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F8FF] transition-colors ${
                  i < toggleItems.length - 1 ? 'border-b border-[#F0F2F5]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                    <Icon style={{ color: item.color, width: 16, height: 16 }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F1B2D]">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                {item.value ? (
                  <ToggleRight className="w-6 h-6 text-[#2F6BFF]" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Settings */}
      <div className="px-4 pt-4">
        <p className="text-[11px] text-gray-400 font-medium mb-2 px-1">其他</p>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {actionItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F8FF] transition-colors ${
                  i < actionItems.length - 1 ? 'border-b border-[#F0F2F5]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                    <Icon style={{ color: item.color, width: 16, height: 16 }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F1B2D]">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Version Info */}
      <div className="flex flex-col items-center py-8 text-gray-300">
        <p className="text-[11px]">达人任务平台</p>
        <p className="text-[10px] mt-0.5">Version 1.0.0</p>
      </div>
    </div>
  );
}