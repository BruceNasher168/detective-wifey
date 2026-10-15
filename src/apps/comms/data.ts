import { record, records, text, number } from '../../shared/data/read';
import type { AppCaseContext } from '../../shared/contracts/app-contracts';

export interface NarrativeRecord { id: string; suspectName: string; clueRefId: string }
export interface Contact extends NarrativeRecord { name: string; phone: string; secondaryPhone: string; notes: string }
export interface Call extends NarrativeRecord { name: string; phone: string; contactId: string; time: string; duration: string; direction: string }
export interface Message extends NarrativeRecord {
  body: string; time: string; outgoing: boolean; canceled: boolean; scheduledTime: string; canceledTime: string;
  reaction?: { type: string; time: string };
}
export interface Thread { id: string; name: string; contactId: string; phone: string; pinned: boolean; unread: boolean; time: string; messages: Message[] }
const value = (row: Record<string, unknown>, ...keys: string[]) => keys.map(key => text(row[key])).find(Boolean) ?? '';
const identity = (row: Record<string, unknown>, id: string): NarrativeRecord => ({ id, suspectName: text(row.suspectName), clueRefId: text(row.clueRefId) });

export function readAppData(input: unknown) {
  const data = record(input);
  const calls: Call[] = records(data.calls).map((row, i) => ({
    ...identity(row, value(row, 'callId', 'id') || `call-${i}`), name: value(row, 'contactName', 'name', 'phoneNumber'),
    phone: text(row.phoneNumber), contactId: text(row.contactId), time: value(row, 'timestamp', 'time'),
    direction: value(row, 'direction', 'type'),
    duration: typeof row.durationSeconds === 'number' && row.durationSeconds >= 0
      ? `${Math.floor(row.durationSeconds / 60)} phút ${row.durationSeconds % 60} giây` : text(row.duration),
  }));
  const contacts: Contact[] = records(data.contacts).map((row, i) => ({
    ...identity(row, value(row, 'contactId', 'id') || `contact-${i}`), name: value(row, 'displayName', 'name', 'primaryPhone'),
    phone: value(row, 'primaryPhone', 'phoneNumber'), secondaryPhone: text(row.secondaryPhone), notes: value(row, 'notesField', 'notes'),
  }));
  // Legacy call-only cases retain their known identities without invented numbers or notes.
  for (const call of calls) if (!contacts.some(c => c.id === call.contactId || (call.phone && c.phone === call.phone) || c.name === call.name)) {
    contacts.push({ id: call.contactId || call.id, name: call.name, phone: call.phone, secondaryPhone: '', notes: '', suspectName: call.suspectName, clueRefId: '' });
  }
  const threads: Thread[] = records(data.threads).map((row, i) => ({
    id: value(row, 'threadId', 'id') || `thread-${i}`, name: value(row, 'senderTitle', 'name'), contactId: text(row.contactId), phone: text(row.phoneNumber),
    pinned: row.isPinned === true, unread: number(row.unreadCount) > 0, time: text(row.lastMessageTimestamp),
    messages: records(row.messages).map((message, j) => ({
      ...identity(message, value(message, 'messageId', 'id') || `message-${i}-${j}`), body: value(message, 'bodyText', 'text'),
      time: value(message, 'timestamp', 'time'), outgoing: message.sender === 'outgoing', canceled: message.isCanceledDraft === true,
      scheduledTime: text(message.scheduledSendTimestamp), canceledTime: text(message.canceledAt),
      reaction: message.tapback && typeof message.tapback === 'object' ? { type: text(record(message.tapback).type), time: text(record(message.tapback).timestamp) } : undefined,
    })),
  }));
  for (const [i, sms] of records(data.sms).entries()) {
    const name = text(sms.sender); const existing = threads.find(t => t.name === name);
    const message: Message = { ...identity(sms, text(sms.id) || `sms-${i}`), body: text(sms.text), time: text(sms.time), outgoing: false, canceled: false, scheduledTime: '', canceledTime: '' };
    if (existing) existing.messages.push(message);
    else threads.push({ id: text(sms.threadId) || `legacy-${name}`, name, contactId: text(sms.contactId), phone: text(sms.phoneNumber), pinned: false, unread: false, time: text(sms.time), messages: [message] });
  }
  return { calls, contacts, threads };
}

export function readCommunicationData(context: AppCaseContext) {
  const legacy = record(context.appsData.comms);
  return readAppData({ ...legacy, ...record(context.appsData.phone), ...record(context.appsData.messages) });
}

export function findContact(call: Call, contacts: Contact[]): Contact {
  return contacts.find(c => (call.contactId && c.id === call.contactId) || (call.phone && c.phone === call.phone) || c.name === call.name)
    ?? { id: call.id, name: call.name || call.phone, phone: call.phone, secondaryPhone: '', notes: '', suspectName: call.suspectName, clueRefId: '' };
}
export function matchThread(contact: Contact, threads: Thread[]) {
  return threads.find(t => (t.contactId && t.contactId === contact.id) || (contact.phone && t.phone === contact.phone) || (contact.name && t.name === contact.name));
}
export function searchThreads(threads: Thread[], query: string) {
  const normalized = query.trim().toLocaleLowerCase('vi');
  return threads.filter(t => `${t.name} ${t.messages.map(m => m.body).join(' ')}`.toLocaleLowerCase('vi').includes(normalized));
}
