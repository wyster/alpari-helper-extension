export class Summary {
    /**
     * Средства в инвестиционных счетах
     */
    public founds: number | undefined = undefined;
    /**
     * Дневной прирост по всем счетам
     */
    public dayGrown: number | undefined = undefined;
    /**
     * Прирост за все время (без учета архивных)
     */
    public grownForAllTimeWithoutArchive: number | undefined = undefined;
    /**
     * Прирост за все время
     */
    public grownForAllTime: number | undefined = undefined;
    /**
     * Баланс по всем инвестиционным счетам
     */
    public totalBalance: number | undefined = undefined;
    /**
     * Активных инвестиционных счетов
     */
    public activeInvestments: number | undefined = undefined;
    /**
     * Архивных инвестиционных счетов
     */
    public archivedInvestments: number | undefined = undefined;
}

export function convertTextToObject(text: string): Summary {
    let prepared = text.trim();
    prepared = prepared.replace(/−/g, '-');
    const preparedArray = prepared.split('\n');
    const summary = new Summary();
    summary.founds = matchNumberValue(preparedArray[0]);
    summary.dayGrown = matchNumberValue(preparedArray[1]);
    summary.grownForAllTimeWithoutArchive = matchNumberValue(preparedArray[2]);
    summary.grownForAllTime = matchNumberValue(preparedArray[3]);
    summary.totalBalance = matchNumberValue(preparedArray[4]);
    summary.activeInvestments = matchNumberValue(preparedArray[5]);
    summary.archivedInvestments = matchNumberValue(preparedArray[6]);

    return summary;
}

function matchNumberValue(find: string): number | undefined {
    const str = find.replace(/\s+/g, '');
    const regExp = new RegExp(/(-|)(\d+\.\d+|\d+)/);
    const value = regExp.exec(str);
    if (!value) {
        return undefined;
    }
    return Number(value[0]);
}
