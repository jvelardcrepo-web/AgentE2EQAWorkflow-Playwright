import { test, expect } from '@playwright/test';
import { login, addToCart, goToCart, fillCheckoutInformation } from './helpers';

// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Checkout Information', () => {
  test.beforeEach(async ({ page }) => {
    // Log in, add an item to the cart, and go to the checkout information page
    await login(page);
    await addToCart(page, 'sauce-labs-backpack');
    await goToCart(page);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Navigate to checkout information page', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('Show error when First Name is empty', async ({ page }) => {
    // Leave 'First Name' empty, fill 'Last Name' and 'Zip/Postal Code'
    await fillCheckoutInformation(page, '', 'Doe', '12345');

    // Click the 'Continue' button
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Show error when Last Name is empty', async ({ page }) => {
    // Fill 'First Name' and 'Zip/Postal Code', leave 'Last Name' empty
    await fillCheckoutInformation(page, 'John', '', '12345');

    // Click the 'Continue' button
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Show error when Zip/Postal Code is empty', async ({ page }) => {
    // Fill 'First Name' and 'Last Name', leave 'Zip/Postal Code' empty
    await fillCheckoutInformation(page, 'John', 'Doe', '');

    // Click the 'Continue' button
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Show error when all fields are empty', async ({ page }) => {
    // Click 'Continue' with all fields empty - first missing field is reported
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('Continue with valid information proceeds to overview', async ({ page }) => {
    await fillCheckoutInformation(page, 'John', 'Doe', '12345');

    // Click the 'Continue' button
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });

  test('Accepts special characters in checkout information fields', async ({ page }) => {
    // SauceDemo does not restrict special characters in these fields
    await fillCheckoutInformation(page, "O'Brian-Jr.", "D'Souza", 'A1B 2C3');

    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('Cancel from checkout information returns to cart', async ({ page }) => {
    // Click the 'Cancel' button
    await page.locator('[data-test="cancel"]').click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});
