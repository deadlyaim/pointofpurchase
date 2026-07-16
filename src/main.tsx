// Safeguard to prevent crashes from third-party scripts (like PayPal SDK or browser extensions)
// that attempt to assign or bind window.fetch in environments where it only has a getter.
try {
  const originalFetch = window.fetch;
  if (originalFetch) {
    let currentFetch = originalFetch;

    const defineSafeFetch = (obj: any) => {
      Object.defineProperty(obj, 'fetch', {
        configurable: true,
        enumerable: true,
        get() {
          return currentFetch;
        },
        set(val) {
          currentFetch = val;
        }
      });
    };

    // Attempt to delete existing fetch properties first to remove any non-configurable or getter-only descriptors (if allowed)
    try {
      delete (window as any).fetch;
    } catch (e) {}
    try {
      delete (globalThis as any).fetch;
    } catch (e) {}
    try {
      if (typeof Window !== 'undefined' && Window.prototype) {
        delete (Window.prototype as any).fetch;
      }
    } catch (e) {}

    // Define getter/setter on window
    try {
      defineSafeFetch(window);
    } catch (e) {
      // Fallback to simple writable data property if getter/setter definition fails
      try {
        Object.defineProperty(window, 'fetch', {
          value: originalFetch,
          writable: true,
          configurable: true,
          enumerable: true
        });
      } catch (err) {
        console.warn('Unable to redefine window.fetch on window:', err);
      }
    }

    // Define getter/setter on globalThis
    try {
      defineSafeFetch(globalThis);
    } catch (e) {}

    // Define getter/setter on Window.prototype
    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        defineSafeFetch(Window.prototype);
      } catch (e) {}
    }
  }
} catch (e) {
  console.warn('Unable to execute window.fetch safeguard:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

