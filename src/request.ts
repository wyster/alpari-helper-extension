import {EventBus} from '@/event-bus';

console.log('request called');

const send = (window as any).XMLHttpRequest.prototype.send;

function sendReplacement(this: any, ...args: []): void {
    if (this.onload) {
        this._onload = this.onload;
    }
    this.onload = onLoadStateChangeReplacement;
    send.apply(this, ...args);
}

function onLoadStateChangeReplacement(this: any, ...args: []) {
    console.log(args);
    args.forEach((e: ProgressEvent) => {
        EventBus.$emit('response', e.target);
    });
    if (this._onreadystatechange) {
        return this._onreadystatechange.apply(this, ...args);
    }
}
(window as any).XMLHttpRequest.prototype.send = sendReplacement;

export {};
