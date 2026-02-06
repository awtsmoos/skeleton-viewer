// B"H
/**
 * The Bridge to Reality.
 * This is now a pure Native JS Module, purged of all external shells.
 */
console.log("B\"H - Index Loader: Initiating Native Sequence...");

// Dynamic import of the core logic to ensure clean separation
import('./main.js')
  .then(module => {
      console.log("B\"H - Native Module Loaded. Igniting Engine...");
      if (module.initNativeApp) {
          module.initNativeApp();
      } else {
          console.error("B\"H - FATAL: initNativeApp not found in main.js export.");
      }
  })
  .catch(err => {
      console.error("B\"H - FATAL: Failed to load main module:", err);
      const errDiv = document.createElement('div');
      errDiv.style.position = 'fixed';
      errDiv.style.top = '0';
      errDiv.style.left = '0';
      errDiv.style.width = '100%';
      errDiv.style.background = 'rgba(50, 0, 0, 0.9)';
      errDiv.style.color = '#ffaaaa';
      errDiv.style.padding = '20px';
      errDiv.style.zIndex = '10000';
      errDiv.style.fontFamily = 'monospace';
      errDiv.innerHTML = `<h1>Divine Error</h1><pre>${err.message}\n${err.stack}</pre>`;
      document.body.appendChild(errDiv);
  });
