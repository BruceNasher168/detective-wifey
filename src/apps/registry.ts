import { AppDefinition, AppId } from '../types/app-contracts';

import { appDefinition as internetMessaging } from './internet-messaging';
import { appDefinition as banking } from './banking';
import { appDefinition as ecommerce } from './ecommerce';
import { appDefinition as rideHailing } from './ride-hailing';
import { appDefinition as webBrowser } from './web-browser';
import { appDefinition as photos } from './photos';
import { appDefinition as comms } from './comms';
import { appDefinition as personalNotes } from './personal-notes';
import { appDefinition as email } from './email';
import { appDefinition as professionalNetwork } from './professional-network';
import { appDefinition as teamCollaboration } from './team-collaboration';

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
  'banking': banking,
  'comms': comms,
};

/**
 * Fast access apps that mount into the frosted dock when active.
 */
export const DOCK_APP_IDS: AppId[] = ['internet-messaging', 'banking', 'comms'];

export function getAppDefinition(appId: AppId): AppDefinition | undefined {
  return APP_REGISTRY[appId];
}

export function getAllApps(): AppDefinition[] {
  return Object.values(APP_REGISTRY);
}

