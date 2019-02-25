interface Item {
    id: number;
    bonus: number;
}

export function prepareList(items: Item[]) {
    items.forEach((item: Item) => {
        if (item.bonus === 0) {
            return;
        }
        const feature = document.querySelector(`.investment-account-list-item-${item.id} .feature`);
        if (!feature) {
            return;
        }
        const newElement = document.createElement('div');
        newElement.innerText = item.bonus.toString();
        feature.appendChild(newElement);
    });
}
