import { AppDefinition, AppId } from '../shared/contracts/app-contracts';

import { appDefinition as internetMessaging } from '../apps/internet-messaging';
import { appDefinition as banking } from '../apps/banking';
import { appDefinition as ecommerce } from '../apps/ecommerce';
import { appDefinition as rideHailing } from '../apps/ride-hailing';
import { appDefinition as webBrowser } from '../apps/web-browser';
import { appDefinition as photos } from '../apps/photos';
import { appDefinition as comms, phoneDefinition, messagesDefinition } from '../apps/comms';
import { appDefinition as personalNotes } from '../apps/personal-notes';
import { appDefinition as email } from '../apps/email';
import { appDefinition as professionalNetwork } from '../apps/professional-network';
import { appDefinition as teamCollaboration } from '../apps/team-collaboration';

/**
 * Pluggable App Registry mapping all 11 registered parody applications.
 * Conforms to Open/Closed Principle (OCP) and Registry Pattern.
 */
export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  'ecommerce': ecommerce,
  'ride-hailing': rideHailing,
  'web-browser': webBrowser,
  'photos': photos,
  'email': email,
  'professional-network': professionalNetwork,
  'team-collaboration': teamCollaboration,
  'personal-notes': personalNotes,
  'internet-messaging': internetMessaging,
  'zola': internetMessaging,
  'banking': banking,
  'comms': comms,
  'phone': phoneDefinition,
  'messages': messagesDefinition,
};

/**
 * Fast access apps that mount into the frosted dock when active.
 */
export const DOCK_APP_IDS: AppId[] = ['phone', 'messages', 'photos'];

export function getAppDefinition(appId: AppId): AppDefinition | undefined {
  return APP_REGISTRY[appId];
}

export function getAllApps(): AppDefinition[] {
  return Object.values(APP_REGISTRY);
}

