# SauceDemo Checkout Test Plan (SCRUM-101)

## Application Overview

Test plan for the SauceDemo (https://www.saucedemo.com) e-commerce checkout flow. Covers cart review, checkout information entry with validation, order overview, order completion, and navigation/edge cases as defined in user story SCRUM-101. All scenarios assume a fresh browser session and login with standard_user/secret_sauce unless stated otherwise.

## Test Scenarios

### 1. Cart Review

**Seed:** `tests/seed.spec.ts`

#### 1.1. Display cart items with details and total options

**File:** `tests/saucedemo-checkout/cart-review.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com and log in with standard_user / secret_sauce
    - expect: User is redirected to the inventory (products) page
  2. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart from the inventory page
    - expect: The cart badge icon shows a count of 2
  3. Click the shopping cart icon to navigate to the cart page
    - expect: URL is /cart.html
    - expect: Page heading shows 'Your Cart'
  4. Inspect the cart item list
    - expect: 'Sauce Labs Backpack' is listed with quantity 1, description, and price $29.99
    - expect: 'Sauce Labs Bike Light' is listed with quantity 1, description, and price $9.99
    - expect: 'Continue Shopping' and 'Checkout' buttons are visible

#### 1.2. Continue shopping returns to the products page

**File:** `tests/saucedemo-checkout/cart-review.spec.ts`

**Steps:**
  1. Log in with standard_user / secret_sauce, add 'Sauce Labs Backpack' to the cart, and navigate to the cart page
    - expect: Cart page shows 1 item
  2. Click the 'Continue Shopping' button
    - expect: User is redirected back to /inventory.html
    - expect: The cart still shows 1 item in the badge

### 2. Checkout Information

**Seed:** `tests/seed.spec.ts`

#### 2.1. Navigate to checkout information page

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add 'Sauce Labs Backpack' to the cart, and go to the cart page
    - expect: Cart page shows the added item
  2. Click the 'Checkout' button
    - expect: User is redirected to /checkout-step-one.html
    - expect: Page heading shows 'Checkout: Your Information'
    - expect: Fields 'First Name', 'Last Name', and 'Zip/Postal Code' are visible

#### 2.2. Show error when First Name is empty

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, go to checkout information page, leave 'First Name' empty, fill 'Last Name' and 'Zip/Postal Code'
  2. Click the 'Continue' button
    - expect: An error message 'Error: First Name is required' is displayed
    - expect: User remains on /checkout-step-one.html

#### 2.3. Show error when Last Name is empty

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, go to checkout information page, fill 'First Name' and 'Zip/Postal Code', leave 'Last Name' empty
  2. Click the 'Continue' button
    - expect: An error message 'Error: Last Name is required' is displayed
    - expect: User remains on /checkout-step-one.html

#### 2.4. Show error when Zip/Postal Code is empty

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, go to checkout information page, fill 'First Name' and 'Last Name', leave 'Zip/Postal Code' empty
  2. Click the 'Continue' button
    - expect: An error message 'Error: Postal Code is required' is displayed
    - expect: User remains on /checkout-step-one.html

#### 2.5. Show error when all fields are empty

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, go to checkout information page, leave all fields empty
  2. Click the 'Continue' button
    - expect: An error message 'Error: First Name is required' is displayed (first missing field is reported)

#### 2.6. Continue with valid information proceeds to overview

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, go to checkout information page, fill 'First Name'='John', 'Last Name'='Doe', 'Zip/Postal Code'='12345'
  2. Click the 'Continue' button
    - expect: User is redirected to /checkout-step-two.html
    - expect: Page heading shows 'Checkout: Overview'

#### 2.7. Accepts special characters in checkout information fields

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, go to checkout information page, fill 'First Name'="O'Brian-Jr.", 'Last Name'="D'Souza", 'Zip/Postal Code'='A1B 2C3'
  2. Click the 'Continue' button
    - expect: User is redirected to /checkout-step-two.html without validation errors, since SauceDemo does not restrict special characters

#### 2.8. Cancel from checkout information returns to cart

**File:** `tests/saucedemo-checkout/checkout-information.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, and go to the checkout information page
  2. Click the 'Cancel' button
    - expect: User is redirected back to /cart.html
    - expect: The previously added item is still present in the cart

### 3. Order Overview

**Seed:** `tests/seed.spec.ts`

#### 3.1. Display order summary with items, payment, shipping and totals

**File:** `tests/saucedemo-checkout/order-overview.spec.ts`

**Steps:**
  1. Log in, add 'Sauce Labs Backpack' ($29.99) and 'Sauce Labs Bike Light' ($9.99) to the cart, go to checkout, and fill in valid information ('John', 'Doe', '12345')
  2. Click 'Continue'
    - expect: User is on /checkout-step-two.html with heading 'Checkout: Overview'
    - expect: Both cart items are listed with quantity 1 and their prices
    - expect: 'Payment Information: SauceCard #31337' is displayed
    - expect: 'Shipping Information: Free Pony Express Delivery!' is displayed
    - expect: 'Item total: $39.98' is displayed
    - expect: 'Tax: $3.20' is displayed
    - expect: 'Total: $43.18' is displayed
    - expect: 'Cancel' and 'Finish' buttons are visible

#### 3.2. Cancel from overview returns to inventory page

**File:** `tests/saucedemo-checkout/order-overview.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, complete checkout information with valid data, and reach the overview page
  2. Click the 'Cancel' button
    - expect: User is redirected to /inventory.html
    - expect: The cart badge still shows the previously added item count

### 4. Order Completion

**Seed:** `tests/seed.spec.ts`

#### 4.1. Complete order and see confirmation message

**File:** `tests/saucedemo-checkout/order-completion.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, complete checkout information with valid data, and reach the overview page
  2. Click the 'Finish' button
    - expect: User is redirected to /checkout-complete.html
    - expect: Page heading shows 'Checkout: Complete!'
    - expect: A 'Thank you for your order!' message is displayed
    - expect: The Pony Express image is displayed
    - expect: A 'Back Home' button is visible

#### 4.2. Back Home returns to products page with empty cart

**File:** `tests/saucedemo-checkout/order-completion.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, complete the full checkout flow through to the confirmation page
  2. Click the 'Back Home' button
    - expect: User is redirected to /inventory.html
    - expect: The cart badge icon is no longer visible, indicating the cart has been emptied

### 5. Navigation and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 5.1. Browser back navigation during checkout preserves session

**File:** `tests/saucedemo-checkout/navigation-edge-cases.spec.ts`

**Steps:**
  1. Log in, add an item to the cart, go to checkout information page, fill in valid data, and continue to the overview page
    - expect: User is on /checkout-step-two.html
  2. Use the browser back navigation to return to the previous page
    - expect: User returns to /checkout-step-one.html
    - expect: Previously entered information may be cleared, but the user remains logged in and the cart retains its items

#### 5.2. Checkout flow is blocked for unauthenticated users

**File:** `tests/saucedemo-checkout/navigation-edge-cases.spec.ts`

**Steps:**
  1. Without logging in, navigate directly to https://www.saucedemo.com/checkout-step-one.html
    - expect: User is redirected to the login page (/) with an error message such as 'Epic sadface: You can only access '/checkout-step-one.html' when you are logged in.'
