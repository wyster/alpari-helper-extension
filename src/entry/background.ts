import * as Command from "@/consts/command";

console.log("background script inited");

chrome.runtime.onMessage.addListener(
  (request: any, sender, response): void => {
    switch (request.command) {
      case Command.OPEN_INVEST_STATS:
        chrome.tabs.create({
          url: chrome.extension.getURL("/invest-stats.html"),
          active: true
        });
        response();
        break;
    }
  }
);
