import { mergeTests } from "@playwright/test";
import { test as loginTest } from "../fixtures/LoginPageFixture";
import { test as dashboardTest, expect } from "../fixtures/DashboardFixture";
import { ApiClient } from "../utils/api/ApiClient";
import { endpoints } from "../utils/api/Endpoints";
import testData from "../utils/data/DataTest.json";

const test = mergeTests(loginTest, dashboardTest);
test.describe("WeatherStack API - Location Identifiers", () => {
  //let api: ApiClient;

  // test.beforeAll(async () => {
  // api = new ApiClient("http://localhost:8080/yourls-api.php");
  //await api.init();
  //});

  test("TC020: Verify the first person at person list after searching can be deleted.", async ({
    dashboardPage,
    loginPage,
  }) => {
    await dashboardPage.goTo();
    await dashboardPage.fillSearchInput(
      "https://www.youtube.com/watch?v=Yxigd9dlsd8"
    );
    await dashboardPage.fillKeyword("video");
    await dashboardPage.clickCreateShortUrl();
  });
});
