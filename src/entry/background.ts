import * as Command from "@/consts/command";
import { browser } from "webextension-polyfill-ts";

console.log("background script inited");

browser.runtime.onMessage.addListener(request => {
  switch (request.command) {
    case Command.OPEN_INVEST_STATS:
      browser.tabs.create({
        url: browser.extension.getURL("/invest-stats.html"),
        active: true
      });
      break;
  }
});
