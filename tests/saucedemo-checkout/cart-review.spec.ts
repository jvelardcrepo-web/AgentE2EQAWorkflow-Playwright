import { test, expect } from '@playwright/test';
import { login, addToCart, goToCart } from './helpers';

// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

test.describe('Cart Review', () => {
  test.beforeEach(async ({ page }) => {
    // Log in with standard_user / secret_sauce
    await login(page);
  });

  test('Display cart items with details and total options', async ({ page }) => {
    // Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart from the inventory page
    await addToCart(page, 'sauce-labs-backpack');
    await addToCart(page, 'sauce-labs-bike-light');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Click the shopping cart icon to navigate to the cart page
    await goToCart(page);
    await expect(page.locator('.title')).toHaveText('Your Cart');

    // Inspect the cart item list
    const items = page.locator('.cart_item');
    await expect(items).toHaveCount(2);

    const backpack = items.filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpack.locator('.cart_quantity')).toHaveText('1');
    await expect(backpack.locator('.inventory_item_desc')).toContainText('carry.allTheThings()');
    await expect(backpack.locator('.inventory_item_price')).toHaveText('$29.99');

    const bikeLight = items.filter({ hasText: 'Sauce Labs Bike Light' });
    await expect(bikeLight.locator('.cart_quantity')).toHaveText('1');
    await expect(bikeLight.locator('.inventory_item_price')).toHaveText('$9.99');

    // 'Continue Shopping' and 'Checkout' buttons are visible
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('Continue shopping returns to the products page', async ({ page }) => {
    // Add 'Sauce Labs Backpack' to the cart and navigate to the cart page
    await addToCart(page, 'sauce-labs-backpack');
    await goToCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Click the 'Continue Shopping' button
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
