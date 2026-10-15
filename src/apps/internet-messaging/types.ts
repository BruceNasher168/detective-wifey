export interface ZolaMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  type?: 'text' | 'location';
  isRead?: boolean;
  clueRefId?: string;
  reaction?: string;
  locationData?: {
    venueName: string;
    address: string;
    mapThumbnail?: string;
  };
}

export interface ZolaThread {
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
  messages: ZolaMessage[];
}

export interface ZolaContact {
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

export interface ZolaCloudDocument {
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

export interface ZolaTimelinePost {
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

export interface ZolaDiscoverData {
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

export interface ZolaDataContract {
  currentUser?: {
    name: string;
    handle: string;
    avatarInitials?: string;
    statusText?: string;
  };
  threads?: ZolaThread[];
  otherThreads?: ZolaThread[];
  contacts?: ZolaContact[];
  cloudDocuments?: ZolaCloudDocument[];
  timelinePosts?: ZolaTimelinePost[];
  discoverData?: ZolaDiscoverData;
}
