import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { RetainedAppView } from './RetainedAppView';
import { AppVisibilityContext } from '../shared/ui/AppVisibilityContext';
import { UniversalEvidenceModal } from '../features/investigation';

describe('retained app presentation', () => {
  it('does not mount an app before its first authorized launch', () => {
    const App = vi.fn(() => <main>Unopened app</main>);
    expect(renderToStaticMarkup(<RetainedAppView active={false}><App /></RetainedAppView>)).toBe('');
    expect(App).not.toHaveBeenCalled();
  });

  it('renders the foreground app without hiding or disabling it', () => {
    const html = renderToStaticMarkup(<RetainedAppView active><main>Current detail</main></RetainedAppView>);
    expect(html).toContain('Current detail');
    expect(html).toContain('aria-hidden="false"');
    expect(html).not.toContain(' inert=');
    expect(html).not.toContain(' hidden=');
  });

  it('suppresses portaled evidence from background apps', () => {
    const modal = <UniversalEvidenceModal isOpen item={{ title: 'Evidence', snippet: 'Story', suspectToTag: 'Name' }}
      onPinEvidence={() => {}} onClose={() => {}} />;
    expect(renderToStaticMarkup(<AppVisibilityContext value={false}>{modal}</AppVisibilityContext>)).toBe('');
    expect(renderToStaticMarkup(modal)).toContain('role="dialog"');
  });
});
