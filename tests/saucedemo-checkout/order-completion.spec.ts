import { test, expect } from '@playwright/test';
import { login, addToCart, goToCart, fillCheckoutInformation } from './helpers';

// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Order Completion', () => {
  test.beforeEach(async ({ page }) => {
    // Log in, add an item to the cart, and complete checkout information with valid data
    await login(page);
    await addToCart(page, 'sauce-labs-backpack');
    await goToCart(page);
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInformation(page, 'John', 'Doe', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('Complete order and see confirmation message', async ({ page }) => {
    // Click the 'Finish' button
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.pony_express')).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('Back Home returns to products page with empty cart', async ({ page }) => {
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Click the 'Back Home' button
    await page.locator('[data-test="back-to-products"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
