import { AppDefinition, AppId } from '../types/app-contracts';

import { appDefinition as loza } from './loza';
import { appDefinition as vietpay } from './vietpay';
import { appDefinition as poshee } from './poshee';
import { appDefinition as grap } from './grap';
import { appDefinition as netsurf } from './netsurf';
import { appDefinition as photos } from './photos';
import { appDefinition as comms } from './comms';
import { appDefinition as husbandNotes } from './husband_notes';
import { appDefinition as geemail } from './geemail';
import { appDefinition as inkedlin } from './inkedlin';
import { appDefinition as tim } from './tim';

/**
 * Pluggable App Registry mapping all 11 registered parody applications.
 * Conforms to Open/Closed Principle (OCP) and Registry Pattern.
 */
export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  poshee,
  grap,
  netsurf,
  photos,
  geemail,
  inkedlin,
  tim,
  husband_notes: husbandNotes,
  loza,
  vietpay,
  comms,
};

/**
 * Fast access apps that mount into the frosted dock when active.
 */
export const DOCK_APP_IDS: AppId[] = ['loza', 'vietpay', 'comms'];

export function getAppDefinition(appId: AppId): AppDefinition | undefined {
  return APP_REGISTRY[appId];
}

export function getAllApps(): AppDefinition[] {
  return Object.values(APP_REGISTRY);
}

