import { test as base } from "./LogInPageFixture";
import * as dotenv from "dotenv";

dotenv.config();

export const test = base.extend({});

test.beforeEach(async ({ logInPage: logInPage }) => {
  await logInPage.goTo();
  await logInPage.fillUsername(process.env.USER_NAME || "");
  await logInPage.fillPassword(process.env.USER_PASSWORD || "");
  await logInPage.clickLoginButton();
});

export { expect } from "@playwright/test";
