import {EventBus} from '@/event-bus';

console.log('request called');

const send = (window as any).XMLHttpRequest.prototype.send;

function sendReplacement(this: any, ...args: []): void {
    console.log('send', args, this);
    if (this.onload) {
        this._onload = this.onload;
    }
    this.onload = onLoadStateChangeReplacement;
    send.apply(this, args);
}

function onLoadStateChangeReplacement(this: any, ...args: []) {
    console.log('onload', args);
    args.forEach((e: ProgressEvent) => {
        console.log('response', e.target);
        EventBus.$emit('response', e.target);
    });
    if (this._onload) {
        return this._onload.apply(this, args);
    }
}
(window as any).XMLHttpRequest.prototype.send = sendReplacement;

export {};
