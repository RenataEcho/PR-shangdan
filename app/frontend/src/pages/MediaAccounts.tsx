import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ExternalLink, Users, Link2, ChevronRight } from 'lucide-react';
import { createClient } from '@metagptx/web-sdk';
import { toast } from 'sonner';

const client = createClient();

// Platform config with colors and icons
const platformConfig: Record<string, { color: string; bgColor: string; icon: string }> = {
  '抖音': { color: '#000000', bgColor: '#00F0FF15', icon: '🎵' },
  '快手': { color: '#FF4906', bgColor: '#FF490615', icon: '🎬' },
  '小红书': { color: '#FE2C55', bgColor: '#FE2C5515', icon: '📕' },
  'B站': { color: '#00A1D6', bgColor: '#00A1D615', icon: '📺' },
  '微博': { color: '#E6162D', bgColor: '#E6162D15', icon: '📝' },
};

const platformOptions = ['抖音', '快手', '小红书', 'B站', '微博'];

interface MediaAccount {
  id: number;
  platform: string;
  nickname: string;
  account_id: string;
  followers: number;
  homepage_url: string;
  avatar_url: string;
  status: string;
  created_at: string;
}

// Fallback demo data for when user is not logged in
const demoAccounts: MediaAccount[] = [
  { id: 1, platform: '抖音', nickname: '创作者小明', account_id: 'xiaoming_2026', followers: 12500, homepage_url: 'https://www.douyin.com/user/xiaoming_2026', avatar_url: '', status: 'active', created_at: '2025-09-15T10:30:00Z' },
  { id: 2, platform: '快手', nickname: '小明爱创作', account_id: 'kuaishou_xiaoming', followers: 8600, homepage_url: 'https://www.kuaishou.com/profile/kuaishou_xiaoming', avatar_url: '', status: 'active', created_at: '2025-11-20T14:00:00Z' },
  { id: 3, platform: '小红书', nickname: '明明的日常', account_id: 'xhs_mingming', followers: 5200, homepage_url: 'https://www.xiaohongshu.com/user/xhs_mingming', avatar_url: '', status: 'active', created_at: '2026-01-08T09:15:00Z' },
];

export default function MediaAccounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<MediaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUnbindConfirm, setShowUnbindConfirm] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    platform: '抖音',
    nickname: '',
    account_id: '',
    followers: '',
    homepage_url: '',
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const user = await client.auth.me();
      if (user?.data) {
        setIsLoggedIn(true);
        const res = await client.entities.media_accounts.query({
          query: { status: 'active' },
          sort: '-created_at',
        });
        setAccounts(res.data?.items || []);
      } else {
        setIsLoggedIn(false);
        setAccounts(demoAccounts);
      }
    } catch {
      // If not logged in, show demo data
      setIsLoggedIn(false);
      setAccounts(demoAccounts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAdd = async () => {
    if (!isLoggedIn) {
      toast.error('请先登录后再添加账号');
      client.auth.toLogin();
      return;
    }
    if (!form.nickname.trim() || !form.account_id.trim()) {
      toast.error('请填写账号昵称和账号ID');
      return;
    }
    if (!form.homepage_url.trim()) {
      toast.error('请填写主页链接');
      return;
    }
    setSubmitting(true);
    try {
      await client.entities.media_accounts.create({
        data: {
          platform: form.platform,
          nickname: form.nickname.trim(),
          account_id: form.account_id.trim(),
          followers: parseInt(form.followers) || 0,
          homepage_url: form.homepage_url.trim(),
          avatar_url: '',
          status: 'active',
          created_at: new Date().toISOString(),
        },
      });
      toast.success('账号绑定成功');
      setShowAddModal(false);
      setForm({ platform: '抖音', nickname: '', account_id: '', followers: '', homepage_url: '' });
      fetchAccounts();
    } catch {
      toast.error('绑定失败，请先登录');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnbind = async (id: number) => {
    if (!isLoggedIn) {
      toast.error('请先登录后再操作');
      return;
    }
    try {
      await client.entities.media_accounts.update({
        id: String(id),
        data: { status: 'inactive' },
      });
      toast.success('已解绑账号');
      setShowUnbindConfirm(null);
      fetchAccounts();
    } catch {
      toast.error('解绑失败');
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    return String(count);
  };

  const getPlatformInfo = (platform: string) => {
    return platformConfig[platform] || { color: '#666', bgColor: '#66666615', icon: '📱' };
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      <div
        className="sticky top-0 z-20"
        style={{ background: 'linear-gradient(180deg, #0F1B2D 0%, #162D50 100%)' }}
      >
        <div className="flex items-center justify-between px-4 pt-12 pb-4">
          <button onClick={() => navigate(-1)} className="text-white/80 active:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white font-bold text-base">媒体账号</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-8 h-8 rounded-full bg-[#2F6BFF] flex items-center justify-center active:bg-[#2558CC] transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-8">
        {/* Stats bar */}
        <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#2F6BFF]" />
              <span className="text-sm text-gray-600">已绑定平台</span>
            </div>
            <span className="text-lg font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              {accounts.length}
            </span>
          </div>
        </div>

        {/* Account list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#2F6BFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm mt-3">加载中...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">暂无绑定的媒体账号</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-2.5 bg-[#2F6BFF] text-white text-sm font-medium rounded-full active:bg-[#2558CC] transition-colors"
            >
              添加账号
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const info = getPlatformInfo(account.platform);
              return (
                <div
                  key={account.id}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
                >
                  {/* Card header with platform badge */}
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: info.bgColor }}
                        >
                          {info.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#0F1B2D]">{account.nickname}</h3>
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                              style={{ backgroundColor: info.bgColor, color: info.color }}
                            >
                              {account.platform}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">ID: {account.account_id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowUnbindConfirm(account.id)}
                        className="p-2 rounded-lg text-gray-300 active:text-red-400 active:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between bg-[#F5F8FF] rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#2F6BFF]" />
                        <span className="text-xs text-gray-500">粉丝</span>
                        <span className="text-xs font-bold text-[#0F1B2D]" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                          {formatFollowers(account.followers)}
                        </span>
                      </div>
                      <a
                        href={account.homepage_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#2F6BFF] text-xs font-medium active:opacity-70"
                      >
                        主页
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add more hint */}
        {accounts.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full mt-3 py-3.5 bg-white rounded-2xl flex items-center justify-center gap-2 text-[#2F6BFF] text-sm font-medium active:bg-blue-50 transition-colors"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px dashed #2F6BFF30' }}
          >
            <Plus className="w-4 h-4" />
            添加新账号
          </button>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full bg-white rounded-t-3xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-base font-bold text-[#0F1B2D]">添加媒体账号</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-sm">
                取消
              </button>
            </div>

            <div className="px-5 pb-8 space-y-4">
              {/* Platform selector */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">选择平台</label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((p) => {
                    const pInfo = getPlatformInfo(p);
                    const selected = form.platform === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setForm({ ...form, platform: p })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          selected
                            ? 'ring-2 ring-[#2F6BFF] bg-[#2F6BFF]/5 text-[#2F6BFF]'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span>{pInfo.icon}</span>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nickname */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">账号昵称</label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  placeholder="请输入账号昵称"
                  className="w-full px-4 py-3 bg-[#F5F8FF] rounded-xl text-sm text-[#0F1B2D] placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-all"
                />
              </div>

              {/* Account ID */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">账号ID</label>
                <input
                  type="text"
                  value={form.account_id}
                  onChange={(e) => setForm({ ...form, account_id: e.target.value })}
                  placeholder="请输入平台账号ID"
                  className="w-full px-4 py-3 bg-[#F5F8FF] rounded-xl text-sm text-[#0F1B2D] placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-all"
                />
              </div>

              {/* Followers */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">粉丝数量</label>
                <input
                  type="number"
                  value={form.followers}
                  onChange={(e) => setForm({ ...form, followers: e.target.value })}
                  placeholder="请输入粉丝数量"
                  className="w-full px-4 py-3 bg-[#F5F8FF] rounded-xl text-sm text-[#0F1B2D] placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-all"
                />
              </div>

              {/* Homepage URL */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">主页链接</label>
                <input
                  type="url"
                  value={form.homepage_url}
                  onChange={(e) => setForm({ ...form, homepage_url: e.target.value })}
                  placeholder="请输入账号主页链接"
                  className="w-full px-4 py-3 bg-[#F5F8FF] rounded-xl text-sm text-[#0F1B2D] placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#2F6BFF]/30 transition-all"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleAdd}
                disabled={submitting}
                className="w-full py-3.5 bg-[#2F6BFF] text-white text-sm font-bold rounded-xl active:bg-[#2558CC] disabled:opacity-50 transition-colors mt-2"
              >
                {submitting ? '绑定中...' : '确认绑定'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unbind Confirm Modal */}
      {showUnbindConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowUnbindConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#0F1B2D] text-center mb-2">确认解绑</h3>
            <p className="text-sm text-gray-500 text-center mb-6">解绑后该账号将不再关联到您的个人资料，确定要解绑吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnbindConfirm(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl active:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleUnbind(showUnbindConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl active:bg-red-600 transition-colors"
              >
                确认解绑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}