import { useState } from 'react';
import { Download, Upload, MessageCircle, ChevronRight, FileText, Link2, Send, ClipboardList } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { myTasks } from '@/lib/mockData';
import type { Task } from '@/lib/mockData';

function TaskCard({ task, onSelect }: { task: Task; onSelect: (t: Task) => void }) {
  return (
    <div
      onClick={() => onSelect(task)}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
      style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
    >
      <div className="flex gap-3 p-4">
        <img src={task.coverImage} alt={task.orderTitle} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#0F1B2D] line-clamp-1 mb-1">{task.orderTitle}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400">ID: {task.orderId}</span>
            <span className="text-[#16C784] font-bold text-sm" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
              {task.commission}
            </span>
          </div>
          {/* Mini Progress */}
          <div className="flex items-center gap-1">
            {task.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    step.status === 'done'
                      ? 'bg-[#16C784]'
                      : step.status === 'current'
                        ? 'bg-[#2F6BFF] animate-pulse'
                        : 'bg-gray-200'
                  }`}
                />
                {i < task.steps.length - 1 && (
                  <div className={`w-4 h-0.5 ${step.status === 'done' ? 'bg-[#16C784]/50' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 self-center flex-shrink-0" />
      </div>
    </div>
  );
}

function TaskDetail({ task, onBack }: { task: Task; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'materials' | 'submit' | 'chat'>('materials');
  const [messageInput, setMessageInput] = useState('');

  const tabs = [
    { key: 'materials' as const, label: '专属资料', icon: Download },
    { key: 'submit' as const, label: '进度提交', icon: Upload },
    { key: 'chat' as const, label: '沟通区', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-20">
      {/* Header */}
      <div className="pt-10 pb-4 px-4" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}>
        <button onClick={onBack} className="text-sm text-[#6C8CFF] font-medium mb-2">
          ← 返回列表
        </button>
        <h2 className="text-base font-bold text-white line-clamp-1">{task.orderTitle}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-white/50">ID: {task.orderId}</span>
          <span className="text-[#16C784] font-bold text-sm" style={{ fontFamily: '"DIN Alternate", "DIN", system-ui' }}>
            {task.commission}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mx-4 -mt-2 relative z-10">
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
          <h3 className="text-sm font-semibold text-[#0F1B2D] mb-3">任务进度</h3>
          <div className="flex items-center justify-between">
            {task.steps.map((step, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.status === 'done'
                        ? 'bg-[#16C784] text-white'
                        : step.status === 'current'
                          ? 'bg-[#2F6BFF] text-white ring-4 ring-[#2F6BFF]/20'
                          : 'bg-[#E6EAF2] text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 whitespace-nowrap ${
                      step.status === 'done'
                        ? 'text-[#16C784] font-medium'
                        : step.status === 'current'
                          ? 'text-[#2F6BFF] font-medium'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < task.steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mt-[-14px] ${
                      step.status === 'done' ? 'bg-[#16C784]/50' : 'bg-[#E6EAF2]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 px-4 mt-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'text-white'
                  : 'bg-white text-gray-600 border border-[#E6EAF2]'
              }`}
              style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)' } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-3">
        {activeTab === 'materials' && (
          <div className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
            <h3 className="text-sm font-semibold text-[#0F1B2D]">下载资料</h3>
            {task.materials.map((mat, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#E6EAF2] last:border-0">
                <div className="flex items-center gap-2.5">
                  {mat.name.includes('链接') ? (
                    <Link2 className="w-4 h-4 text-[#2F6BFF]" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#2F6BFF]" />
                  )}
                  <span className="text-sm text-gray-700">{mat.name}</span>
                </div>
                <button className="text-xs text-[#2F6BFF] font-medium px-3 py-1 rounded-lg bg-[#2F6BFF]/10">
                  {mat.name.includes('链接') ? '复制' : '下载'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
            <h3 className="text-sm font-semibold text-[#0F1B2D] mb-3">提交素材</h3>
            <p className="text-xs text-gray-500 mb-4">
              当前节点：<span className="text-[#2F6BFF] font-medium">{task.steps[task.currentStep].label}</span>
            </p>
            <div className="border-2 border-dashed border-[#E6EAF2] rounded-2xl p-8 flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 mb-3">点击或拖拽上传素材</p>
              <button
                className="px-5 py-2 text-white text-sm font-medium rounded-xl active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)' }}
              >
                选择文件
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-3">支持 MP4、MOV、JPG、PNG 格式，单文件不超过500MB</p>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {task.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.isMe ? 'order-1' : ''}`}>
                    <p className={`text-[10px] mb-0.5 ${msg.isMe ? 'text-right' : ''} text-gray-400`}>
                      {msg.sender} · {msg.time}
                    </p>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        msg.isMe
                          ? 'text-white rounded-br-sm'
                          : 'bg-[#F5F8FF] text-gray-700 rounded-bl-sm'
                      }`}
                      style={msg.isMe ? { background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)' } : {}}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E6EAF2] p-3 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-3 py-2 bg-[#F5F8FF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]/30"
              />
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #6C8CFF 100%)' }}
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function TaskCenter() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (selectedTask) {
    return <TaskDetail task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] pb-20">
      {/* Header */}
      <div className="pt-10 pb-5 px-4" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1D3557 100%)' }}>
        <h1 className="text-white text-xl font-bold">任务中心</h1>
        <p className="text-white/50 text-xs mt-1">管理你的进行中任务</p>
      </div>

      {/* Task List */}
      <div className="px-4 pt-3 space-y-3">
        {myTasks.length > 0 ? (
          myTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ClipboardList className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">暂无进行中的任务</p>
            <p className="text-xs mt-1 text-gray-300">去首页接单吧~</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}