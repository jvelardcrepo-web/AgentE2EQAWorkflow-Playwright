import { Page, expect } from '@playwright/test';

export const BASE_URL = 'https://www.saucedemo.com';

export async function login(page: Page, username = 'standard_user', password = 'secret_sauce') {
  await page.goto(BASE_URL);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

export async function addToCart(page: Page, productTestId: string) {
  await page.locator(`[data-test="add-to-cart-${productTestId}"]`).click();
}

export async function goToCart(page: Page) {
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
}

export async function fillCheckoutInformation(page: Page, firstName: string, lastName: string, postalCode: string) {
  await page.locator('[data-test="firstName"]').fill(firstName);
  await page.locator('[data-test="lastName"]').fill(lastName);
  await page.locator('[data-test="postalCode"]').fill(postalCode);
}
