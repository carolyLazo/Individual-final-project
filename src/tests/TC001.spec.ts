import { mergeTests } from "@playwright/test";
import { expect } from "../fixtures/LogInPageFixture";
import { test as loggedInTest } from "../fixtures/LoggedInPageFixture";
import { test as dashboardPage } from "../fixtures/DashboardFixture";
import data from "../utils/data/DataTest.json";
import { url } from "inspector";

const test = mergeTests(loggedInTest, dashboardPage);

test.describe("YOURLS add shorturls", () => {
  for (const urls of data) {
    test(`Short ure for ${urls.title} was created`, async ({
      dashboardPage,
      page,
    }) => {
      await dashboardPage.goTo();
      await dashboardPage.fillURL(urls.url);
      await dashboardPage.fillKeyword(urls.keyword);
      await dashboardPage.clickCreateShortUrl();
    });
  }
});
