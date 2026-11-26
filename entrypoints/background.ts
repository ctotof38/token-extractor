export default defineBackground(() => {
  let lastCapturedToken: string | null = null;

  const actionApi = (browser as any).browserAction ?? (browser as any).action;
  actionApi?.setTitle({ title: 'Click ici pour enregistrer la clé Playiad' });
  // chrome.action.setTitle({ title: 'Click ici pour enregistrer la clef playiad' });

  chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (details.tabId < 0) return;

      if (details.requestHeaders) {
        for (const header of details.requestHeaders) {
          if (header.name.toLowerCase() === 'authorization' && header.value) {
            if (header.value.startsWith('Bearer ')) {
              const token = header.value.substring(7);

              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTab = tabs[0];
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