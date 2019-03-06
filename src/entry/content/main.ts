import * as Command from '@/consts/command';

appendScriptSrc('dist/page/main.js');

function appendScriptSrc(src: string): Promise<any> {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = chrome.runtime.getURL(src);
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

interface InvestStats {
    stats: object;
    date: Date;
    activeAccounts: object;
}

async function getActiveAccounts(): Promise<any> {
    const url = 'https://my.alpari.com/ru/investments/pamm_accounts/download/investment_accounts.json';
    const response: Response = await fetch(url);
    return response.json();
}

window.addEventListener('message', async (message: MessageEvent) => {
    switch (message.data.command as string) {
        case Command.SAVE_INVEST_STATS:
            const preparedData: InvestStats = {
                stats: message.data.data,
                date: new Date(),
                activeAccounts: await getActiveAccounts(),
            };
            chrome.storage.local.get(['investStats'], ({investStats: result}) => {
                if (typeof result === 'undefined') {
                    result = [];
                }
                result.push(preparedData);
                chrome.storage.local.set({investStats: result});
            });
            break;
    }
});

export {};
