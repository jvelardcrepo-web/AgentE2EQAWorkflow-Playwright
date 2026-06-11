import { test, expect } from '@playwright/test';
import { login, addToCart, goToCart, fillCheckoutInformation } from './helpers';

// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Order Overview', () => {
  test.beforeEach(async ({ page }) => {
    // Log in, add two items to the cart, go to checkout, and fill in valid information
    await login(page);
    await addToCart(page, 'sauce-labs-backpack');
    await addToCart(page, 'sauce-labs-bike-light');
    await goToCart(page);
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInformation(page, 'John', 'Doe', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('Display order summary with items, payment, shipping and totals', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');

    // Both cart items are listed with quantity 1 and their prices
    const items = page.locator('.cart_item');
    await expect(items).toHaveCount(2);

    // Payment and shipping information
    await expect(page.locator('.summary_info')).toContainText('Payment Information:');
    await expect(page.locator('.summary_info')).toContainText('SauceCard #31337');
    await expect(page.locator('.summary_info')).toContainText('Shipping Information:');
    await expect(page.locator('.summary_info')).toContainText('Free Pony Express Delivery!');

    // Subtotal, tax and total
    await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $39.98');
    await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $3.20');
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $43.18');

    // 'Cancel' and 'Finish' buttons are visible
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
  });

  test('Cancel from overview returns to inventory page', async ({ page }) => {
    // Click the 'Cancel' button
    await page.locator('[data-test="cancel"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });
});
