/** Only production builds cache assets; development remains uncached. */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const register = () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { updateViaCache: 'none' })
      .catch(error => console.warn('Offline registration failed:', error));
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
