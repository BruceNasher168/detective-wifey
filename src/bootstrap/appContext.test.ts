import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { APP_REGISTRY } from './appRegistry';
import { createAppContext } from './appContext';
import { loadCase } from '../features/case-runtime';
import type { AppId } from '../shared/contracts/app-contracts';

describe('app host projection', () => {
  it('excludes truth, expected answers, and sibling payloads', () => {
    const source = loadCase('case_02');
    const context = createAppContext(source, 'banking');
    expect(context).not.toHaveProperty('groundTruth');
    expect(context.lockChallenges.every(challenge => !('expectedAnswer' in challenge))).toBe(true);
    expect(Object.keys(context.appsData).every(key => ['banking', 'techcornbank', 'vietpay'].includes(key))).toBe(true);
    expect(source.groundTruth).toBeDefined();
    expect(source.lockChallenges.some(challenge => 'expectedAnswer' in challenge)).toBe(true);
  });

  it('renders every registered app for every bundled level using only its public context', () => {
    for (const caseId of ['case_01', 'case_02', 'case_03']) {
      const config = loadCase(caseId);
      for (const [appId, definition] of Object.entries(APP_REGISTRY)) {
        const html = renderToStaticMarkup(createElement(definition.component, {
          caseData: createAppContext(config, appId as AppId),
          unlockedChallenges: new Set<string>(), onTagSuspect: vi.fn(), onReturnHome: vi.fn(), onRequestUnlock: vi.fn(),
        }));
        expect(html.length, `${caseId}/${appId}`).toBeGreaterThan(0);
      }
    }
  });
});
