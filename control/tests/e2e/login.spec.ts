import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Public Key endpoint
    // Using Regex to match regardless of host
    await page.route(/\/auth\/public-key/, async (route) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      if (route.request().method() === "OPTIONS") {
        await route.fulfill({
          status: 200,
          headers: { ...headers, "Access-Control-Allow-Headers": "*" },
        });
        return;
      }

      const json = {
        data: {
          public_key: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp76YR63mJ17frM56t8kL
yrAvMpwltmr7FVjO2K9dtHfGo5GnVkBcC0vyHJoQj3XZhPlZd23A/Ii1Frs36PkS
nXKfS+/gVZd/8uTIYjBaCrI0KgXszGJa6KBafpZ/jy2xaaph4U3Nbd9Yp5r5hHDV
KuQrh0GUF25TjUeTHFU1RmVAt0gemfoT8yFgNb7EzI9147YcYrMLwxNLHIIkmWxV
TC4RdUu3rJh5xZux6Do9a2S3+rkOn9IBHUhEuCLVA7gX6zlWov4YRRiQ/43jHtOY
K9vhdjcgCepmNlE2TFvIHkXBDOcu6zw35j8V3xulTj28uVu+jc95s6LWI4hXOlbr
FQIDAQAB
-----END PUBLIC KEY-----`,
        },
      };
      await route.fulfill({ json, headers });
    });

    // Mock the Login endpoint
    await page.route(/\/auth\/login/, async (route) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      if (route.request().method() === "OPTIONS") {
        await route.fulfill({
          status: 200,
          headers: { ...headers, "Access-Control-Allow-Headers": "*" },
        });
        return;
      }

      // Add delay to verify loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const json = {
        status: true,
        data: {
          sessionId: "test-session-id",
          user: {
            id: "test-user-id",
            email: "admin@uverus.tech",
            firstName: "Test",
            lastName: "Admin",
          },
          access_token: "fake-access-token",
        },
        message: "Logged in successfully",
      };
      await route.fulfill({ json, headers });
    });
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/");

    // Check if on login page
    await expect(
      page.getByRole("heading", { name: "Welcome to Uverus" }),
    ).toBeVisible();

    // Fill in credentials
    await page.getByLabel("Email Address").fill("admin@uverus.tech");
    await page.getByLabel("Password").fill("Password123!");

    // Submit form
    await page.getByRole("button", { name: "Authenticate Account" }).click();

    // Verify loading state
    await expect(page.getByText("Securing Session...")).toBeVisible();

    // Verify success toast/redirection
    // The page redirects to /verify/test-session-id
    await expect(page).toHaveURL(/\/verify\/test-session-id/);
  });

  test("should show error on invalid credentials (mocked error)", async ({
    page,
  }) => {
    // Override login mock for this specific test
    await page.route("**/auth/login", async (route) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      if (route.request().method() === "OPTIONS") {
        await route.fulfill({
          status: 200,
          headers: { ...headers, "Access-Control-Allow-Headers": "*" },
        });
        return;
      }

      const json = {
        status: false,
        message: "Invalid email or password",
      };
      await route.fulfill({ status: 401, json, headers });
    });

    await page.goto("/");

    await page.getByLabel("Email Address").fill("wrong@uverus.tech");
    await page.getByLabel("Password").fill("WrongPassword");
    await page.getByRole("button", { name: "Authenticate Account" }).click();

    // Verify error message
    // Note: The error might appear in multiple places (form and toast), so we check that at least one is visible
    await expect(
      page.getByText("Invalid email or password").first(),
    ).toBeVisible();
  });
});
