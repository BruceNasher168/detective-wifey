export type HistoryPriority = 'high' | 'medium' | 'regular' | 'low';

export interface MessagingMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time?: string;
  timestamp?: string;
  type?: 'text' | 'location' | 'image';
  imageAsset?: string;
  imageAlt?: string;
  isRead?: boolean;
  clueRefId?: string;
  reaction?: string;
  locationData?: {
    venueName: string;
    address: string;
    mapThumbnail?: string;
  };
}

export interface MessagingThread {
  historyPriority?: HistoryPriority;
  threadId: string;
  contactName: string;
  avatarGradient?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isPinned?: boolean;
  isDisguised?: boolean;
  isMuted?: boolean;
  suspectId?: string;
  realIdentity?: string;
  systemBanner?: string;
  messages: MessagingMessage[];
}

export interface MessagingContact {
  historyPriority?: HistoryPriority;
  id: string;
  name: string;
  phone?: string;
  department?: string;
  note?: string;
  isBlocked?: boolean;
  avatarGradient?: string;
  section: string;
  suspectName?: string;
}

export interface MessagingCloudDocument {
  id: string;
  fileName: string;
  date: string;
  fileSize: string;
  description: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'xlsx' | 'doc' | 'text' | 'link';
  clueRefId?: string;
  suspectTag?: string;
  senderName?: string;
  senderAvatar?: string;
  time?: string;
  fullDate?: string;
  previewHeader?: string;
  previewTitle?: string;
  previewSubtitle?: string;
  previewSnippet?: string;
  textMessage?: string;
  imageUrl?: string;
}

export interface MessagingTimelinePost {
  id: string;
  author: string;
  avatarGradient?: string;
  avatarInitials?: string;
  timestamp: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  suspectTag?: string;
}

export interface MessagingDiscoverData {
  promoBanner?: {
    tag: string;
    badge: string;
    title: string;
    subtitle: string;
  };
  miniApps?: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  officialAccounts?: Array<{
    id: string;
    name: string;
    category: string;
    badge: string;
    color?: string;
  }>;
}

export interface MessagingDataContract {
  currentUser?: {
    name: string;
    handle: string;
    avatarInitials?: string;
    statusText?: string;
  };
  threads?: MessagingThread[];
  otherThreads?: MessagingThread[];
  contacts?: MessagingContact[];
  cloudDocuments?: MessagingCloudDocument[];
  timelinePosts?: MessagingTimelinePost[];
  discoverData?: MessagingDiscoverData;
}

// Backward-compatible aliases
export type ZolaMessage = MessagingMessage;
export type ZolaThread = MessagingThread;
export type ZolaContact = MessagingContact;
export type ZolaCloudDocument = MessagingCloudDocument;
export type ZolaTimelinePost = MessagingTimelinePost;
export type ZolaDiscoverData = MessagingDiscoverData;
export type ZolaDataContract = MessagingDataContract;
