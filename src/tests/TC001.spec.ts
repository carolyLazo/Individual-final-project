import { mergeTests } from "@playwright/test";
import { expect } from "../fixtures/LogInPageFixture";
import { test as loggedInTest } from "../fixtures/LoggedInPageFixture";
import { test as dashboardPage } from "../fixtures/DashboardFixture";
import data from "../utils/data/DataTest.json";
import { ApiClient } from "../utils/api/ApiClient";
import { config } from "../utils/config/config";
import { EndPoints } from "../utils/api/endpoints";
import { getConnection } from "../utils/database/Connection";
import { Connection, RowDataPacket } from "mysql2/promise";

const test = mergeTests(loggedInTest, dashboardPage);
let api: any;
let connection: Connection;
test.describe("YOURLS add shorturls", () => {
  test.beforeAll(async () => {
    api = new ApiClient("http://localhost:8080");
    await api.init();
    connection = await getConnection();
  });
  for (const urls of data) {
    test(`Short ure for ${urls.title} was created`, async ({
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
      console.log(`Short URL: ${responseData.shorturl}`);
      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM yourls_url WHERE keyword = ?;",
        [urls.keyword]
      );
      expect(rows.length, "DB record count").toBeGreaterThan(0);
      expect(rows[0].url, "DB URL").toContain(urls.url);
      console.log(`Keyword: ${rows[0].keyword}`);
    });
  }
});
