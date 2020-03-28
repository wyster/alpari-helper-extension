import { EventBus } from "@/event-bus";
import xhook from "xhook";

console.log("request called");

xhook.after((request: any, response: any) => {
  console.log("request", request);
  console.log("response", response);
  EventBus.$emit("response", response);
});

export {};
