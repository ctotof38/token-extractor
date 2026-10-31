export default defineBackground(() => {
  let lastCapturedToken: string | null = null;

  chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      // On ignore les requêtes qui ne proviennent pas d'un onglet (ex: requêtes du navigateur lui-même)
      if (details.tabId < 0) return;

      if (details.requestHeaders) {
        for (const header of details.requestHeaders) {
          if (header.name.toLowerCase() === 'authorization' && header.value) {
            if (header.value.startsWith('Bearer ')) {
              const token = header.value.substring(7);
              
              // Vérification asynchrone de l'onglet actif
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTab = tabs[0];
                // On ne stocke le token que s'il provient de l'onglet actif
                if (activeTab && activeTab.id === details.tabId) {
                  lastCapturedToken = token;
                  console.log('Token capturé (onglet actif) :', lastCapturedToken);
                }
              });
            }
          }
        }
      }
    },
    { urls: ['<all_urls>'] },
    ['requestHeaders']
  );

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getToken') {
      sendResponse({ token: lastCapturedToken });
    }
  });
});