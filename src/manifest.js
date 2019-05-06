
module.exports = {
  name: 'Talk Screencast Extension',
  version: '1.0.0',
  description: 'Talk Screencast saver extension',
  author: 'Sergio Carracedo <info@sergiocarracedo.es>',
  manifest_version: 2,
  icons: { '16': 'icons/16.png', '128': 'icons/128.png' },
  permissions: [
    '<all_urls>',
    '*://*/*',
    'tabs',
    'tabCapture',
    'activeTab',
    'background',
    'unlimitedStorage',
    'storage',
    'desktopCapture'
  ],
  browser_action: {
    default_title: 'title'
  },
  background: {
    persistent: false,
    scripts: ['js/background.js']
  },
  options_page: 'pages/options.html',
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: [ ]
}
