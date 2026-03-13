import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Search, MessageCircle, FileText, CreditCard, Shield, Smartphone } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqCategories = [
  { id: 'all', label: '全部', icon: FileText },
  { id: 'task', label: '任务相关', icon: MessageCircle },
  { id: 'wallet', label: '钱包提现', icon: CreditCard },
  { id: 'account', label: '账号安全', icon: Shield },
  { id: 'media', label: '媒体账号', icon: Smartphone },
];

const faqList: FaqItem[] = [
  {
    id: 'F001',
    question: '如何报名参加任务？',
    answer: '在首页或任务中心浏览可用任务，点击进入任务详情页，确认任务要求和佣金后，点击底部的"立即报名"按钮即可。报名后请按照任务步骤完成相关内容。',
    category: 'task',
  },
  {
    id: 'F002',
    question: '任务佣金什么时候结算？',
    answer: '不同任务的结算周期不同，一般在视频审核通过后7个工作日内结算。具体结算规则请查看每个任务详情页中的"结算规则"说明。结算完成后佣金会自动到达您的钱包余额。',
    category: 'task',
  },
  {
    id: 'F003',
    question: '视频审核不通过怎么办？',
    answer: '如果视频审核未通过，系统会发送消息通知并说明原因。您可以根据审核意见修改后重新提交。常见原因包括：视频时长不符合要求、未展示指定内容、画质不清晰等。',
    category: 'task',
  },
  {
    id: 'F004',
    question: '如何提现到银行卡或支付宝？',
    answer: '进入"我的"页面，点击钱包区域的"提现"按钮。选择已绑定的收款账户，输入提现金额和提现密码即可。提现一般1-3个工作日到账，单笔最低提现金额为50元。',
    category: 'wallet',
  },
  {
    id: 'F005',
    question: '提现手续费是多少？',
    answer: '目前平台提现免手续费。每月前3次提现完全免费，超过3次后每次收取2元手续费。建议合理规划提现频次。',
    category: 'wallet',
  },
  {
    id: 'F006',
    question: '如何修改登录密码？',
    answer: '进入"我的"页面，点击"账号安全"，选择"登录密码"进行修改。需要先验证原密码，然后设置新密码。密码长度不少于6位，建议包含字母和数字。',
    category: 'account',
  },
  {
    id: 'F007',
    question: '忘记提现密码怎么办？',
    answer: '如果忘记提现密码，请进入"账号安全"页面，选择"提现密码"，通过手机验证码验证身份后重新设置。如遇问题请联系客服。',
    category: 'account',
  },
  {
    id: 'F008',
    question: '如何绑定/解绑媒体账号？',
    answer: '进入"我的"页面，点击"媒体账号"，可以查看已绑定的账号。点击"添加账号"可绑定新的抖音或快手账号，点击已有账号的"解绑"按钮可解除绑定。注意：解绑后进行中的任务可能受影响。',
    category: 'media',
  },
  {
    id: 'F009',
    question: '为什么我看不到某些任务？',
    answer: '部分任务有门槛要求，如粉丝数、账号类型等。请确认您的媒体账号信息是否满足任务要求。您可以在任务详情页查看具体的准入门槛。',
    category: 'task',
  },
  {
    id: 'F010',
    question: '如何联系客服？',
    answer: '您可以通过以下方式联系客服：1. 在任务详情页的消息区域直接与审核员沟通；2. 发送邮件至 support@example.com；3. 工作日9:00-18:00拨打客服热线 400-888-8888。',
    category: 'account',
  },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqList.filter((faq) => {
    const matchCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchSearch = !searchQuery || faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchCategory && matchSearch;
  });

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
          <h1 className="text-white text-base font-bold">帮助中心</h1>
          <div className="w-8" />
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索常见问题..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2F6BFF]/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {faqCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#2F6BFF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-gray-500 active:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ List */}
      <div className="px-4 space-y-2.5 pb-8">
        {filteredFaqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">未找到相关问题</p>
            <p className="text-[11px] text-gray-300 mt-1">换个关键词试试</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl overflow-hidden transition-all"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F8FF] transition-colors"
                >
                  <span className="text-sm font-medium text-[#0F1B2D] pr-3">{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#2F6BFF] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-[#F0F2F5] pt-3">
                      <p className="text-xs text-gray-500 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}