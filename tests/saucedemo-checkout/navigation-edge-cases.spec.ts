import { test, expect } from '@playwright/test';
import { login, addToCart, goToCart, fillCheckoutInformation, BASE_URL } from './helpers';

// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Navigation and Edge Cases', () => {
  test('Browser back navigation during checkout preserves session', async ({ page }) => {
    // Log in, add an item to the cart, fill in valid data, and continue to the overview page
    await login(page);
    await addToCart(page, 'sauce-labs-backpack');
    await goToCart(page);
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInformation(page, 'John', 'Doe', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Use the browser back navigation to return to the previous page
    await page.goBack();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    // The user remains logged in and the cart retains its items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Checkout flow is blocked for unauthenticated users', async ({ page }) => {
    // Without logging in, navigate directly to the checkout information page
    await page.goto(`${BASE_URL}/checkout-step-one.html`);

    // User is redirected to the login page with an error message
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: You can only access '/checkout-step-one.html' when you are logged in."
    );
  });
});
