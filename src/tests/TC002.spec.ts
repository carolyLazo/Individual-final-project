import { mergeTests } from "@playwright/test";
import { expect } from "../fixtures/LogInPageFixture";
import { test as loggedInTest } from "../fixtures/LoggedInPageFixture";
import { test as dashboardPage } from "../fixtures/DashboardFixture";
import data from "../utils/data/DataTest.json";
import { ApiClient } from "../utils/api/ApiClient";
import { config } from "../utils/config/config";
import { DatabaseClient } from "../utils/database/dbClient";
import { EndPoints } from "../utils/api/endpoints";
import { RowDataPacket } from "mysql2/promise";

const test = mergeTests(loggedInTest, dashboardPage);

test.describe("YOURLS End-to-End Tests create shortURL", () => {
  let api: ApiClient;
  let db: DatabaseClient;

  test.beforeAll(async () => {
    api = new ApiClient(config.apiBaseUrl);
    await api.init();
    db = new DatabaseClient();
    await db.connect();
  });

  for (const urls of data) {
    test(`Short URL for ${urls.title} was created`, async ({
      dashboardPage,
      page,
    }) => {
      await dashboardPage.goTo();
      await dashboardPage.fillURL(urls.url);
      await dashboardPage.fillKeyword(urls.keyword);
      await dashboardPage.clickCreateShortUrl();

      const params = {
        signature: "caed1384a5",
        action: "expand",
        shorturl: urls.keyword,
        format: "json",
      };
      const response = await api.get(EndPoints.yourls.basic, params);
      const responseData = await response.json();
      expect(response.status(), "Status code").toBe(200);
      const rows = (await db.query(
        "SELECT keyword, url FROM yourls_url WHERE keyword = ?",
        [urls.keyword]
      )) as RowDataPacket[];

      expect(rows.length).toBe(1);
      expect(rows[0].keyword).toBe(urls.keyword);
      expect(rows[0].url).toBe(urls.url);
    });
  }
  test.afterAll(async () => {
    if (db) await db.disconnect();
  });
});
