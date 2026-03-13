import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, CheckCircle2, AlertCircle, ListChecks, Share2, Link2, Image, X } from 'lucide-react';
import { orders } from '@/lib/mockData';
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

function ShareCardPreview({ order, onClose }: { order: typeof orders[0]; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const renderPrice = () => {
    switch (order.priceType) {
      case 'fixed':
        return order.priceFixed;
      case 'range':
        return `¥${order.priceMin} - ${order.priceMax}`;
      case 'negotiable':
        return order.priceLabel || '面议';
      default:
        return '';
    }
  };

  const handleSaveCard = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const link = document.createElement('a');
      link.download = `任务分享-${order.title}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('分享卡片已保存！');
    } catch {
      toast.error('保存失败，请截图分享');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-[340px] animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Share Card */}
        <div ref={cardRef} className="bg-white rounded-2xl overflow-hidden">
          {/* Card Header with cover */}
          <div className="relative h-36">
            <img src={order.coverImage} alt={order.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B2D]/40 to-[#0F1B2D]/80" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex flex-wrap gap-1 mb-1.5">
                {order.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/20 text-white backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-white font-bold text-base line-clamp-2 leading-tight">{order.title}</h3>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4">
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{order.detailDescription}</p>

            {/* Commission */}
            <div className="flex items-center justify-between bg-[#F5F8FF] rounded-xl p-3 mb-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">任务佣金</p>
                <p className="text-[#16C784] font-bold text-xl" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                  {renderPrice()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 mb-0.5">任务类型</p>
                <p className="text-sm font-medium text-[#0F1B2D]">{order.category}</p>
              </div>
            </div>

            {/* Steps preview */}
            <div className="mb-3">
              <p className="text-[10px] text-gray-400 mb-1.5">完成步骤</p>
              <div className="space-y-1">
                {order.steps.slice(0, 3).map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2F6BFF]/10 flex items-center justify-center text-[9px] font-bold text-[#2F6BFF] flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-[11px] text-gray-600 line-clamp-1">{step}</span>
                  </div>
                ))}
                {order.steps.length > 3 && (
                  <p className="text-[10px] text-gray-400 ml-6">还有 {order.steps.length - 3} 个步骤...</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E6EAF2]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)' }}>
                  达
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#0F1B2D]">达人接单平台</p>
                  <p className="text-[9px] text-gray-400">扫码或搜索查看详情</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-[#F5F8FF] rounded-lg flex items-center justify-center">
                <span className="text-[8px] text-gray-400 text-center leading-tight">任务ID<br />{order.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveCard}
          className="w-full mt-3 py-3 rounded-xl text-sm font-semibold text-white active:scale-[0.96] transition-transform"
          style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.3)' }}
        >
          保存分享卡片
        </button>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const order = orders.find((o) => o.id === id);

  const handleEnroll = useCallback(() => {
    setEnrolled(true);
    toast.success('报名成功！请前往任务中心查看', { duration: 2000 });
  }, []);

  const handleCopyLink = useCallback(() => {
    if (!order) return;
    const url = `${window.location.origin}/order/${order.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('任务链接已复制！');
      setShowShareSheet(false);
    }).catch(() => {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      toast.success('任务链接已复制！');
      setShowShareSheet(false);
    });
  }, [order]);

  const handleShareCard = useCallback(() => {
    setShowShareSheet(false);
    setShowShareCard(true);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>任务不存在</p>
          <button onClick={() => navigate('/')} className="mt-3 text-[#2F6BFF] text-sm font-medium">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const renderPrice = () => {
    switch (order.priceType) {
      case 'fixed':
        return order.priceFixed;
      case 'range':
        return `¥${order.priceMin} - ${order.priceMax}`;
      case 'negotiable':
        return order.priceLabel || '面议';
      default:
        return '';
    }
  };

  const tagColorMap: Record<string, string> = {
    'VIP任务': 'bg-amber-500/10 text-amber-600',
    '高佣任务': 'bg-[#16C784]/10 text-[#16C784]',
    '官方任务': 'bg-[#2F6BFF]/10 text-[#2F6BFF]',
    'CPA': 'bg-purple-500/10 text-purple-600',
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-24">
      {/* Cover Image */}
      <div className="relative">
        <img src={order.coverImage} alt={order.title} className="w-full h-52 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B2D]/60 via-transparent to-[#F5F8FF]" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        {/* Share button in header */}
        <button
          onClick={() => setShowShareSheet(true)}
          className="absolute top-10 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
        >
          <Share2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-10 space-y-3">
        {/* Title Card */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {order.tags.map((tag) => (
              <span key={tag} className={`px-2 py-0.5 rounded text-[10px] font-medium ${tagColorMap[tag] || 'bg-gray-100 text-gray-500'}`}>
                {tag}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0F1B2D]/5 text-[#0F1B2D]/60">
              {order.category}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#0F1B2D] mb-2">{order.title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{order.detailDescription}</p>
          <div className="flex items-center gap-4 pt-3 border-t border-[#E6EAF2]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">佣金</span>
              <span className="text-[#16C784] font-bold text-2xl" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
                {renderPrice()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">ID: {order.id}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-[#2F6BFF]" />
            完成步骤
          </h2>
          <div className="space-y-3">
            {order.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#2F6BFF]/10 flex items-center justify-center text-xs font-bold text-[#2F6BFF] flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" />
            具体要求
          </h2>
          <ul className="space-y-2">
            {order.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF] mt-1.5 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Settlement Rules */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <span className="text-[#16C784]">💰</span>
            审核规则
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{order.settlementRules}</p>
        </div>

        {/* Threshold */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-semibold text-[#0F1B2D] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2F6BFF]" />
            参与门槛
          </h2>
          <div className="space-y-2">
            {order.threshold.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E6EAF2] p-4 safe-area-bottom z-50" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div className="flex gap-3">
          <button
            onClick={() => setShowShareSheet(true)}
            className="w-12 h-12 rounded-xl bg-[#F5F8FF] border border-[#E6EAF2] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          >
            <Share2 className="w-5 h-5 text-[#2F6BFF]" />
          </button>
          <button
            onClick={handleEnroll}
            disabled={enrolled}
            className={`flex-1 py-3.5 rounded-xl text-base font-semibold transition-all ${
              enrolled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'text-white active:scale-[0.96]'
            }`}
            style={!enrolled ? { background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)', boxShadow: '0 4px 16px rgba(47,107,255,0.3)' } : {}}
          >
            {enrolled ? '已报名' : '立即报名'}
          </button>
        </div>
      </div>

      {/* Share Bottom Sheet */}
      {showShareSheet && (
        <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm" onClick={() => setShowShareSheet(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300 safe-area-bottom"
            style={{ maxWidth: '480px', margin: '0 auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-semibold text-[#0F1B2D] mb-4">分享任务</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Generate Share Card */}
              <button
                onClick={handleShareCard}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-[#F5F8FF] border border-[#E6EAF2] active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' }}>
                  <Image className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#0F1B2D]">生成分享卡片</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">保存图片分享给好友</p>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-[#F5F8FF] border border-[#E6EAF2] active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)' }}>
                  <Link2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#0F1B2D]">复制任务链接</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">发送链接给好友</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowShareSheet(false)}
              className="w-full py-3 rounded-xl text-sm font-medium text-gray-500 bg-[#F5F8FF] active:scale-[0.98] transition-transform"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Share Card Preview */}
      {showShareCard && (
        <ShareCardPreview order={order} onClose={() => setShowShareCard(false)} />
      )}
    </div>
  );
}