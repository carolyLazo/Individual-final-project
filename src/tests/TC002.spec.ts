import { mergeTests, expect } from "@playwright/test";
import { test as loggedInTest } from "../fixtures/LoggedInPageFixture";
import { test as dashboardPage } from "../fixtures/DashboardFixture";
import { ApiClient } from "../utils/api/ApiClient";
import { EndPoints } from "../utils/api/endpoints";
import { getConnection } from "../utils/database/Connection";
import { Connection, RowDataPacket } from "mysql2/promise";

const test = mergeTests(loggedInTest, dashboardPage);

let connection: Connection;
let api: ApiClient;

test.describe("YOURLS - Edit Short URL", () => {
  test.beforeAll(async () => {
    api = new ApiClient("http://localhost:8080");
    await api.init();
    connection = await getConnection();
  });

  test("TC002 - Edit short URL in UI and verify in API + DB", async ({
    dashboardPage,
  }) => {
    await dashboardPage.goTo();
    await dashboardPage.clickFirstRow();
    await dashboardPage.clickEditButton();
    await dashboardPage.fillNewKeyword("edited");
    await dashboardPage.summitChanges();
    const params = {
      signature: "caed1384a5",
      action: "expand",
      shorturl: "edited",
      format: "json",
    };

    const response = await api.get(EndPoints.yourls.basic, params);
    const responseData = await response.json();
    console.log("API response data:", responseData);
    expect(response.status(), "Status code").toBe(200);
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM yourls_url WHERE keyword = ?;",
      ["edited"]
    );
    expect(rows.length).toBe(1);
    console.log("Database rows:", rows);
  });

  test.afterAll(async () => {
    await connection.end();
  });
});
