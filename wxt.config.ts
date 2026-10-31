import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome',
  manifest: {
    name: "Token Extractor",
    icons: {
      16: "/icon/icon-16.png",
      48: "/icon/icon-48.png",
      128: "/icon/icon-128.png",
    },
    version: "1.0.0",
    description: "Allows you to easily capture and copy the Bearer authorization token from the active tab.",
    browser_specific_settings: {
      gecko: {
        id: "ctotof-token-extractor@free.fr", // (n'importe quelle chaîne unique au format email)
      },
    },
    permissions: [
      'webRequest',
      'clipboardWrite',
      'activeTab'
    ],
    host_permissions: ['<all_urls>'],
  },
});