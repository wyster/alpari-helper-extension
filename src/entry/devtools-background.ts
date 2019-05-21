import { browser } from "webextension-polyfill-ts";

console.log("devtools background inited");

browser.devtools.panels.create(
  "AlpariHelper",
  "/dist/favicon.ico",
  "/pages/devtools.html"
);
