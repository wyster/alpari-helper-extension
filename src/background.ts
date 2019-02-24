console.log('background script inited');
chrome.tabs.query(
  {
    url: [
      '*://my.alpari.com/*',
      '*://alpari.com/*',
      '*://localhost:*/*',
    ],
  },
  (tabs) => {
    console.log('Alpari tabs', tabs.length, tabs);
    tabs.forEach((tab) => {
        if (!tab.id) {
            return;
        }
        chrome.tabs.executeScript(
        tab.id,
        {
          file: 'dist/app.js',
          runAt: 'document_start',
        },
        () => {
           console.log(`Alpari tab '${tab.id}' injected`);
        },
      );
    });
  },
);
