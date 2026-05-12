// @ts-check
import { test, expect } from '@playwright/test';

test('Page Exists', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    await expect(page).toHaveTitle(/Swag Labs/);
});

test.describe('Add to Cart Feature', () => {
  test('Add to Cart via inventory page and Check Added Item ', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    const addToCartButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await addToCartButton.waitFor({
      state: 'visible'
    });

    await addToCartButton.click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText('1');

    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    // Verify cart item exists
    await expect(
      page.locator('[data-test="inventory-item"]')
    ).toBeVisible();

    // Verify item name
    await expect(
      page.locator('[data-test="inventory-item-name"]')
    ).toHaveText('Sauce Labs Backpack');

    // Verify quantity
    await expect(
      page.locator('[data-test="item-quantity"]')
    ).toHaveText('1');

    // Verify price
    await expect(
      page.locator('[data-test="inventory-item-price"]')
    ).toHaveText('$29.99');

    // Verify remove button
    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();
  });
  test('Add to Cart via individual item page and Check Added Item ', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    await page.locator('[data-test="item-4-img-link"]').click();

    await page.waitForURL('**/inventory-item.html?id=4');

    await expect(page.locator('.inventory_details_name')).toHaveText(
      'Sauce Labs Backpack'
    );

    const addToCartButton = page.locator(
      '[data-test="add-to-cart"]'
    );

    await addToCartButton.waitFor({
      state: 'visible'
    });

    await addToCartButton.click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText('1');

    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    // Verify cart item exists
    await expect(
      page.locator('[data-test="inventory-item"]')
    ).toBeVisible();

    // Verify item name
    await expect(
      page.locator('[data-test="inventory-item-name"]')
    ).toHaveText('Sauce Labs Backpack');

    // Verify quantity
    await expect(
      page.locator('[data-test="item-quantity"]')
    ).toHaveText('1');

    // Verify price
    await expect(
      page.locator('[data-test="inventory-item-price"]')
    ).toHaveText('$29.99');

    // Verify remove button
    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();
  });

  test('Add Multiple Item to Cart and Check Cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    const addToCartButtons = page.locator('[data-test^="add-to-cart-"]');

    // Save count BEFORE clicking
    const itemCount = await addToCartButtons.count();

    while (await addToCartButtons.count() > 0) {
      await addToCartButtons.first().click();
    }

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText(itemCount.toString());
    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    // Verify cart item exists
    await expect(
      page.locator('[data-test="inventory-item"]')
    ).toHaveCount(itemCount);

    const expectedItems = [
      {
        name: 'Sauce Labs Backpack',
        quantity: '1',
        price: '$29.99',
        removeButton: 'remove-sauce-labs-backpack'
      },
      {
        name: 'Sauce Labs Bike Light',
        quantity: '1',
        price: '$9.99',
        removeButton: 'remove-sauce-labs-bike-light'
      },
      {
        name: 'Sauce Labs Bolt T-Shirt',
        quantity: '1',
        price: '$15.99',
        removeButton: 'remove-sauce-labs-bolt-t-shirt'
      },
      {
        name: 'Sauce Labs Fleece Jacket',
        quantity: '1',
        price: '$49.99',
        removeButton: 'remove-sauce-labs-fleece-jacket'
      },
      {
        name: 'Sauce Labs Onesie',
        quantity: '1',
        price: '$7.99',
        removeButton: 'remove-sauce-labs-onesie'
      },
      {
        name: 'Test.allTheThings() T-Shirt (Red)',
        quantity: '1',
        price: '$15.99',
        removeButton: 'remove-test.allthethings()-t-shirt-(red)'
      }
    ];
    for (const item of expectedItems) {
      const cartItem = page
        .locator('[data-test="inventory-item"]')
        .filter({
          has: page.locator('[data-test="inventory-item-name"]', {
            hasText: item.name
          })
      });

      await expect(
        cartItem.locator('[data-test="inventory-item-name"]')
      ).toHaveText(item.name);

      await expect(
        cartItem.locator('[data-test="item-quantity"]')
      ).toHaveText(item.quantity);

      await expect(
        cartItem.locator('[data-test="inventory-item-price"]')
      ).toHaveText(item.price);

      await expect(
        cartItem.locator(`[data-test="${item.removeButton}"]`)
      ).toBeVisible();
    }
  });

  test('Remove Item from Cart & Inventory', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    const addToCartButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await addToCartButton.waitFor({
      state: 'visible'
    });

    await addToCartButton.click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText('1');
    const removeButton = page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    );
    await expect(removeButton).toBeVisible();
    
    await removeButton.click();
    
    await expect(addToCartButton).toBeVisible();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).not.toBeVisible();

    const addToCartButtonRedo = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await addToCartButtonRedo.waitFor({
      state: 'visible'
    });

    await addToCartButtonRedo.click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText('1');
    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    const removeButtonInCart = page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    );

    await expect(removeButtonInCart).toBeVisible();

    await removeButtonInCart.click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).not.toBeVisible();

    // Verify cart is empty
    await expect(
      page.locator('[data-test="inventory-item"]')
    ).not.toBeVisible();
  });
});

test.describe('Checkout Process', () => {
  test('Checkout with Single Item', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    const addToCartButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await addToCartButton.waitFor({
      state: 'visible'
    });

    await addToCartButton.click();

    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    const checkoutButton = page.locator('[data-test="checkout"]');

    await expect(checkoutButton).toBeVisible();

    await checkoutButton.click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    const continueButton = page.locator('[data-test="continue"]');

    await expect(continueButton).toBeVisible();

    await continueButton.click();

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Verify item details on checkout overview
    const itemName = page.locator('[data-test="inventory-item-name"]');
    const itemPrice = page.locator('[data-test="inventory-item-price"]');

    await expect(itemName).toHaveText('Sauce Labs Backpack');
    await expect(itemPrice).toHaveText('$29.99');

    const finishButton = page.locator('[data-test="finish"]');

    await expect(finishButton).toBeVisible();

    await finishButton.click();

    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Verify order completion message
    const completionMessage = page.locator('.complete-header');

    await expect(completionMessage).toHaveText('Thank you for your order!');
  });
  test('Checkout with Multiple Items', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    const addToCartButtons = page.locator('[data-test^="add-to-cart-"]');

    // Save count BEFORE clicking
    const itemCount = await addToCartButtons.count();

    while (await addToCartButtons.count() > 0) {
      await addToCartButtons.first().click();
    }

    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    const checkoutButton = page.locator('[data-test="checkout"]');

    await expect(checkoutButton).toBeVisible();

    await checkoutButton.click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    const continueButton = page.locator('[data-test="continue"]');

    await expect(continueButton).toBeVisible();

    await continueButton.click();

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Verify item details on checkout overview
    const itemNames = page.locator('[data-test="inventory-item-name"]');
    const itemPrices = page.locator('[data-test="inventory-item-price"]');

    const expectedItems = [
      { name: 'Sauce Labs Backpack', price: '$29.99' },
      { name: 'Sauce Labs Bike Light', price: '$9.99' },
      { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
      { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
      { name: 'Sauce Labs Onesie', price: '$7.99' },
      { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' }
    ];

    for (let i = 0; i < expectedItems.length; i++) {
      await expect(itemNames.nth(i)).toHaveText(expectedItems[i].name);
      await expect(itemPrices.nth(i)).toHaveText(expectedItems[i].price);
    }

    const finishButton = page.locator('[data-test="finish"]');

    await expect(finishButton).toBeVisible();

    await finishButton.click();

    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Verify order completion message
    const completionMessage = page.locator('.complete-header');

    await expect(completionMessage).toHaveText('Thank you for your order!');
  });
  test('Checkout with Empty Cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    const checkoutButton = page.locator('[data-test="checkout"]');

    await expect(checkoutButton).toBeVisible();

    await checkoutButton.click();

    // Verify we stay on the cart page and show an error message
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    const errorMessage = page.locator('.error-message-container');

    await expect(errorMessage).toHaveText('Your cart is empty');
  });
  test('Checkout with Missing Information', async ({ page }) => {
    await page.goto('https://www.saucedemo.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL('**/inventory.html');

    const addToCartButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await addToCartButton.waitFor({
      state: 'visible'
    });

    await addToCartButton.click();

    const cartLink = page.locator('[data-test="shopping-cart-link"]');

    await expect(cartLink).toBeVisible();

    await cartLink.click();

    await expect(page).toHaveURL(/cart\.html/);

    const checkoutButton = page.locator('[data-test="checkout"]');

    await expect(checkoutButton).toBeVisible();

    await checkoutButton.click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Leave all fields empty and click continue
    const continueButton = page.locator('[data-test="continue"]');

    await expect(continueButton).toBeVisible();

    await continueButton.click();

    // Verify we stay on the checkout step one page and show an error message
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    const errorMessage = page.locator('.error-message-container');

    await expect(errorMessage).toHaveText('Error: First Name is required');
  });
});

