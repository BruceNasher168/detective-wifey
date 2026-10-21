import { createContext } from 'react';

// Portaled app overlays must follow their owning app's visibility.
export const AppVisibilityContext = createContext(true);
