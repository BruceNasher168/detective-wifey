import { record, records, text, textFields, number } from '../../shared/data/read';
import type { ZolaDataContract, ZolaThread, ZolaMessage, ZolaCloudDocument } from './types';

function message(data: Record<string, unknown>): ZolaMessage {
  const location = record(data.locationData);
  return {
    ...textFields(data, ['id', 'text', 'time', 'clueRefId', 'reaction'] as const),
    sender: data.sender === 'me' ? 'me' : 'them',
    type: data.type === 'location' ? 'location' : 'text', isRead: data.isRead === true,
    locationData: data.locationData ? textFields(location, ['venueName', 'address', 'mapThumbnail'] as const) : undefined,
  };
}

function thread(data: Record<string, unknown>): ZolaThread {
  return {
    ...textFields(data, ['threadId', 'contactName', 'avatarGradient', 'lastMessage', 'timestamp', 'suspectId', 'realIdentity', 'systemBanner'] as const),
    unreadCount: number(data.unreadCount), isPinned: data.isPinned === true,
    isDisguised: data.isDisguised === true, isMuted: data.isMuted === true,
    messages: records(data.messages).map(message),
  };
}

function document(data: Record<string, unknown>): ZolaCloudDocument {
  const type = text(data.fileType);
  return {
    ...textFields(data, ['id', 'fileName', 'date', 'fileSize', 'description', 'clueRefId', 'suspectTag', 'senderName', 'senderAvatar', 'time', 'fullDate', 'previewHeader', 'previewTitle', 'previewSubtitle', 'previewSnippet', 'textMessage', 'imageUrl'] as const),
    fileType: type === 'pdf' || type === 'jpg' || type === 'png' || type === 'xlsx' || type === 'doc' || type === 'link' ? type : 'text',
  };
}

export function readMessagingData(value: unknown): ZolaDataContract {
  const data = record(value);
  const discover = record(data.discoverData);
  return {
    currentUser: data.currentUser ? textFields(data.currentUser, ['name', 'handle', 'avatarInitials', 'statusText'] as const) : undefined,
    threads: records(data.threads).map(thread), otherThreads: records(data.otherThreads).map(thread),
    contacts: records(data.contacts).map(contact => ({
      ...textFields(contact, ['id', 'name', 'phone', 'department', 'note', 'avatarGradient', 'section', 'suspectName'] as const),
      isBlocked: contact.isBlocked === true,
    })),
    cloudDocuments: records(data.cloudDocuments).map(document),
    timelinePosts: Array.isArray(data.timelinePosts) ? records(data.timelinePosts).map(post => ({
      ...textFields(post, ['id', 'author', 'avatarGradient', 'avatarInitials', 'timestamp', 'content', 'suspectTag'] as const),
      likesCount: number(post.likesCount), commentsCount: number(post.commentsCount),
    })) : undefined,
    discoverData: data.discoverData ? {
      promoBanner: discover.promoBanner ? textFields(discover.promoBanner, ['tag', 'badge', 'title', 'subtitle'] as const) : undefined,
      miniApps: Array.isArray(discover.miniApps) ? records(discover.miniApps).map(row => textFields(row, ['id', 'name', 'icon', 'color'] as const)) : undefined,
      officialAccounts: Array.isArray(discover.officialAccounts) ? records(discover.officialAccounts).map(row => textFields(row, ['id', 'name', 'category', 'badge', 'color'] as const)) : undefined,
    } : undefined,
  };
}
