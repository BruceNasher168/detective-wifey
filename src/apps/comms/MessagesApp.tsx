import { useState } from 'react';
import { IoChatbubble, IoSearch, IoHeart, IoThumbsUp, IoHappy, IoAlert, IoChevronForward, IoClose, IoTimeOutline } from 'react-icons/io5';
import type { VirtualAppProps, AppDefinition } from '../../shared/contracts/app-contracts';
import { SwipeBackContainer } from '../../shared/ui/SwipeBackContainer';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { readCommunicationData, searchThreads, type Message } from './data';
import { CommunicationHeader, EmptyState, useCommunicationEvidence } from './components/CommunicationChrome';
import './communications.css';

const reactions = { heart: IoHeart, like: IoThumbsUp, laugh: IoHappy, exclamation: IoAlert };
const reactionLabels: Record<string, string> = { heart: 'Yêu thích', like: 'Thích', laugh: 'Cười', exclamation: 'Nhấn mạnh' };
export function MessagesApp(props: VirtualAppProps) {
  const data = readCommunicationData(props.caseData);
  const [query, setQuery] = useState('');
  const [threadId, setThreadId] = useState<string | null>(props.initialThreadId ?? null);
  const [draft, setDraft] = useState<Message | null>(null);
  const [reactionTime, setReactionTime] = useState<string | null>(null);
  const thread = data.threads.find(t => t.id === threadId);
  const evidence = useCommunicationEvidence(props.caseData.caseId, props.onTagSuspect, 'messages');
  const visible = searchThreads(data.threads, query);
  const pinned = query.trim() ? [] : visible.filter(t => t.pinned);
  const back = () => { setThreadId(null); setReactionTime(null); };
  const openThread = (id: string) => { setThreadId(id); setReactionTime(null); };
  const row = (t: typeof data.threads[number]) => <button type="button" className="messages-thread-row" key={t.id} onClick={() => openThread(t.id)}>
    <span className={`messages-unread ${t.unread ? 'is-unread' : ''}`} aria-label={t.unread ? 'Chưa đọc' : undefined} />
    <span className="communication-avatar">{t.name.slice(0, 2)}</span><span className="communication-flex-copy"><span className="messages-thread-heading"><strong>{t.name}</strong><time>{t.time}</time><IoChevronForward aria-hidden="true" /></span><span className="messages-preview">{t.messages.filter(m => !m.canceled).slice(-1)[0]?.body || 'Chưa có tin nhắn'}</span></span>
  </button>;
  return <SwipeBackContainer className="min-h-[44px] communication-app messages-app" onBack={threadId ? back : props.onReturnHome} enabled={!draft && !evidence.active}>
    <CommunicationHeader title={threadId ? thread?.name || 'Tin nhắn' : 'Tin nhắn'} backLabel={threadId ? 'Tin nhắn' : 'Trang chủ'} onBack={threadId ? back : props.onReturnHome} />
    {!threadId ? <main className="communication-scroll">
      <h2 className="communication-large-title">Tin nhắn</h2>
      <div className="messages-search"><IoSearch aria-hidden="true" /><input aria-label="Tìm kiếm tin nhắn" placeholder="Tìm kiếm tin nhắn" value={query} onChange={e => setQuery(e.target.value)} />{query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setQuery('')}><IoClose /></button>}</div>
      {pinned.length > 0 && <section className="messages-pinned" aria-label="Hội thoại ưu tiên">{pinned.map(t => <button type="button" key={t.id} onClick={() => openThread(t.id)}><span className="communication-avatar">{t.name.slice(0, 2)}</span><span>{t.name}</span></button>)}</section>}
      {visible.length ? visible.filter(t => query.trim() || !t.pinned).map(row) : <EmptyState>{query.trim() ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện'}</EmptyState>}
    </main> : thread ? <main className="communication-scroll messages-conversation">
      {!thread.messages.length && <EmptyState>Chưa có tin nhắn</EmptyState>}
      {thread.messages.filter(m => !m.canceled).map(message => {
        const Reaction = reactions[message.reaction?.type as keyof typeof reactions] ?? IoHeart;
        return <article key={message.id} className={`messages-message ${message.outgoing ? 'is-outgoing' : ''}`}>
          {evidence.wrap(message, thread.name, [message.body, message.time].filter(Boolean).join(' · '), <div className="messages-bubble">{message.body}</div>)}
          {message.time && <time>{message.time}</time>}
          {message.reaction && <div className="messages-reaction">{evidence.wrap({ ...message, id: `${message.id}:reaction` }, thread.name,
            `${reactionLabels[message.reaction.type] || 'Phản ứng'} · ${message.reaction.time}`,
            <button type="button" aria-label={`Xem thời gian phản ứng ${reactionLabels[message.reaction.type] || ''}`} onClick={() => setReactionTime(message.reaction?.time || 'Không có thời gian phản ứng')}><Reaction aria-hidden="true" /><span>{reactionLabels[message.reaction.type] || 'Phản ứng'}</span></button>)}</div>}
        </article>;
      })}
      {reactionTime && <p className="communication-feedback" role="status">{reactionTime}</p>}
      {thread.messages.filter(m => m.canceled).map(message => <button type="button" className="messages-draft-link" key={message.id} onClick={() => setDraft(message)}><IoTimeOutline />Xem bản nháp hẹn giờ đã hủy<IoChevronForward /></button>)}
    </main> : <EmptyState>Không có cuộc trò chuyện</EmptyState>}
    {draft && <BottomSheet title="Bản nháp đã hủy" onClose={() => setDraft(null)} suspended={evidence.active}>
      <p className="messages-draft-recipient">Người nhận: {thread?.name}</p>
      {evidence.wrap(draft, thread?.name || 'Bản nháp đã hủy', [draft.body, draft.scheduledTime, draft.canceledTime].filter(Boolean).join(' · '), <div className="messages-draft-body"><p>{draft.body}</p>{draft.scheduledTime && <p>Dự kiến gửi: {draft.scheduledTime}</p>}{draft.canceledTime && <p>Đã hủy lúc: {draft.canceledTime}</p>}</div>)}
      <p className="messages-read-only">Chỉ xem</p>
    </BottomSheet>}
    {evidence.modal}
  </SwipeBackContainer>;
}
export const messagesDefinition: AppDefinition = {
  appId: 'messages', dataKeys: ['comms', 'messages'], displayName: 'Tin nhắn', icon: IoChatbubble,
  themeGradient: 'from-green-400 to-green-600', themeColor: '#FFFFFF', bottomBarColor: '#FFFFFF', isLocked: false, component: MessagesApp,
};
