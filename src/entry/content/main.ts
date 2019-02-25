appendScriptSrc('dist/page/main.js');

function appendScriptSrc(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = chrome.runtime.getURL(src);
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

export {};
