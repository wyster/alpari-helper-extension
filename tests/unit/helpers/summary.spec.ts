import { expect } from "chai";
import { convertTextToObject } from "@/helper/summary";

describe("helper/summary", (): void => {
  it("convertTextToObject", (): void => {
    const result = convertTextToObject(`
Средства в инвестиционных счетах:  1 047.40 USD
Дневной прирост по всем счетам:  40.73 USD
Прирост за все время (без учета архивных):  −22.92 USD
Прирост за все время:  −22.31 USD
Баланс по всем инвестиционным счетам:  1 094.41 USD
Активных инвестиционных счетов:  20
Инвестиционные счета в архиве:  57`);
    expect(result.founds).to.equal(1047.4);
    expect(result.dayGrown).to.equal(40.73);
    expect(result.grownForAllTimeWithoutArchive).to.equal(-22.92);
    expect(result.grownForAllTime).to.equal(-22.31);
    expect(result.totalBalance).to.equal(1094.41);
    expect(result.activeInvestments).to.equal(20);
    expect(result.archivedInvestments).to.equal(57);
  });
});
