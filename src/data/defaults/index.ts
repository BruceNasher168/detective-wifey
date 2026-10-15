import internetMessagingDefault from './internet-messaging.json';
import bankingDefault from './banking.json';
import ecommerceDefault from './ecommerce.json';
import commsDefault from './comms.json';
import rideHailingDefault from './ride-hailing.json';
import webBrowserDefault from './web-browser.json';
import photosDefault from './photos.json';
import emailDefault from './email.json';
import teamCollaborationDefault from './team-collaboration.json';
import professionalNetworkDefault from './professional-network.json';
import personalNotesDefault from './personal-notes.json';

export const DEFAULT_APPS_DATA: Record<string, unknown> = {
  'internet-messaging': internetMessagingDefault,
  'banking': bankingDefault,
  'ecommerce': ecommerceDefault,
  'comms': commsDefault,
  'ride-hailing': rideHailingDefault,
  'web-browser': webBrowserDefault,
  'photos': photosDefault,
  'email': emailDefault,
  'team-collaboration': teamCollaborationDefault,
  'professional-network': professionalNetworkDefault,
  'personal-notes': personalNotesDefault,
};

