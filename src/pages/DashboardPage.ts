import { Page } from "@playwright/test";
import { DashboardLocators } from "../locators/DashbodarLocators";

export class DashboardPage {
  constructor(public page: Page) {}

  async goTo() {
    await this.page.goto("/admin/index=php?");
  }

  async fillURL(urlLink: string) {
    await this.page.locator(DashboardLocators.urlInput).fill(urlLink);
  }

  async fillKeyword(keyword: string) {
    await this.page.locator(DashboardLocators.keywordInput).fill(keyword);
  }

  async clickCreateShortUrl() {
    await this.page.locator(DashboardLocators.summitUrlButton).click();
  }

  async fillSearchInput(word: string) {
    await this.page.locator(DashboardLocators.inputSearch).fill(word);
  }

  async clickSearchButton() {
    await this.page.locator(DashboardLocators.searchButton).click();
  }

  async clickFirstRow() {
    const hoverRow = await this.page
      .locator(DashboardLocators.firstRow)
      .first();
    await hoverRow.hover();
  }

  async clickDeleteButton() {
    await this.page.locator(DashboardLocators.deleteButton).dblclick();
  }

  async clickEditButton() {
    await this.page.locator(DashboardLocators.editButton).click();
  }

  async fillNewKeyword(newKeyword: string) {
    await this.page.locator(DashboardLocators.newKeyword).fill(newKeyword);
  }
  async summitChanges() {
    await this.page.locator(DashboardLocators.summitChanges).click();
  }

  async clickRemoveConfirmationButton() {
    await this.page.locator(DashboardLocators.removeConfirmationButton).click();
  }
  async getKeywordInTable() {
    return await this.page.locator(DashboardLocators.keywordInList).innerText();
  }
}
