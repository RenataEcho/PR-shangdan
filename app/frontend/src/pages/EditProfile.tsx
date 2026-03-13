import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { userProfile } from '@/lib/mockData';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState(userProfile.name);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!nickname.trim()) {
      toast.error('昵称不能为空');
      return;
    }
    if (nickname.trim().length > 20) {
      toast.error('昵称不能超过20个字符');
      return;
    }

    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      toast.success('个人资料已更新');
      navigate(-1);
    }, 800);
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
          <h1 className="text-white text-base font-bold">编辑资料</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-[#6C8CFF] text-sm font-semibold active:text-[#2F6BFF] transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative">
          <button
            onClick={handleAvatarClick}
            className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#2F6BFF] to-[#6C8CFF] flex items-center justify-center shadow-xl shadow-blue-500/20 ring-4 ring-white active:scale-95 transition-transform"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white/80" />
            )}
          </button>
          {/* Camera badge */}
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2F6BFF] flex items-center justify-center shadow-lg border-2 border-white">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
          {/* Remove button */}
          {avatarPreview && (
            <button
              onClick={handleRemoveAvatar}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg border-2 border-white"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">点击头像更换</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Form */}
      <div className="px-4">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {/* Nickname */}
          <div className="px-4 py-4 border-b border-[#F0F2F5]">
            <label className="text-[11px] text-gray-400 font-medium block mb-2">昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder="请输入昵称"
              className="w-full h-11 px-4 rounded-xl bg-[#F5F8FF] border border-[#E8ECF4] text-sm text-[#0F1B2D] placeholder:text-gray-300 focus:outline-none focus:border-[#2F6BFF] focus:ring-1 focus:ring-[#2F6BFF]/20 transition-all"
            />
            <div className="flex justify-end mt-1.5">
              <span className={`text-[10px] ${nickname.length > 18 ? 'text-orange-400' : 'text-gray-300'}`}>
                {nickname.length}/20
              </span>
            </div>
          </div>

          {/* Read-only fields */}
          <div className="px-4 py-4 border-b border-[#F0F2F5]">
            <label className="text-[11px] text-gray-400 font-medium block mb-2">抖音号</label>
            <div className="h-11 px-4 rounded-xl bg-gray-50 border border-[#E8ECF4] flex items-center">
              <span className="text-sm text-gray-400">{userProfile.douyinId}</span>
            </div>
            <p className="text-[10px] text-gray-300 mt-1.5">抖音号暂不支持修改</p>
          </div>

          <div className="px-4 py-4 border-b border-[#F0F2F5]">
            <label className="text-[11px] text-gray-400 font-medium block mb-2">手机号</label>
            <div className="h-11 px-4 rounded-xl bg-gray-50 border border-[#E8ECF4] flex items-center">
              <span className="text-sm text-gray-400">{userProfile.phone}</span>
            </div>
            <p className="text-[10px] text-gray-300 mt-1.5">如需修改手机号请联系客服</p>
          </div>

          <div className="px-4 py-4">
            <label className="text-[11px] text-gray-400 font-medium block mb-2">等级</label>
            <div className="h-11 px-4 rounded-xl bg-gray-50 border border-[#E8ECF4] flex items-center">
              <span className="text-sm text-gray-400">{userProfile.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (bottom) */}
      <div className="px-4 mt-6 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white active:scale-[0.97] transition-transform disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.3)' }}
        >
          {saving ? '保存中...' : '保存修改'}
        </button>
      </div>
    </div>
  );
}