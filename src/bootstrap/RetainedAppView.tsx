import { useState, type ReactNode } from 'react';
import { AppVisibilityContext } from '../shared/ui/AppVisibilityContext';

/** Keep both React state and native scroll offsets until the session is reset. */
export function RetainedAppView({ active, children }: { active: boolean; children: ReactNode }) {
  const [visited, setVisited] = useState(active);
  if (active && !visited) setVisited(true);
  if (!active && !visited) return null;
  return <div data-app-instance hidden={!active} inert={!active} aria-hidden={!active}
    className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    style={{ display: active ? undefined : 'none' }}>
    <AppVisibilityContext value={active}>{children}</AppVisibilityContext>
  </div>;
}
