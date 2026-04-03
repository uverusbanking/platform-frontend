import { test, expect } from "@playwright/test";

test.describe("Forgot Password Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Debug: Log requests
    page.on("request", (request) =>
      console.log(">>", request.method(), request.url()),
    );
    page.on("requestfailed", (request) =>
      console.log(
        ">> FAILED:",
        request.method(),
        request.url(),
        request.failure()?.errorText,
      ),
    );

    // Mock Public Key (needed for reset password step later)
    await page.route(/\/auth\/public-key/, async (route) => {
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
      await route.fulfill({
        json,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    });

    // Mock Forgot Password (Step 1)
    await page.route(/\/auth\/forgot-password/, async (route) => {
      // Step 1 always returns 200 OK
      await route.fulfill({
        status: 200,
        json: { status: true, message: "Recovery link sent" },
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    });

    // Mock Verify OTP (Step 2)
    await page.route(/\/auth\/verify-forgot-otp/, async (route) => {
      const payload = route.request().postDataJSON();

      if (payload.otp === "123456") {
        await route.fulfill({
          status: 200,
          json: { session_id: "test-session-id" }, // Matches user spec: Response: { "session_id": "uuid-string" }
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      } else {
        await route.fulfill({
          status: 400,
          json: { message: "Invalid OTP" },
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    });
  });

  test("should verify OTP successfully", async ({ page }) => {
    // 1. Go to Forgot Password
    await page.goto("/forgot-password");
    await expect(
      page.getByRole("heading", { name: "Account Recovery" }),
    ).toBeVisible();

    // 2. Submit Email
    await page.getByLabel("Email Address").fill("test@example.com");
    await page.getByRole("button", { name: "Send Recovery Link" }).click();

    // 3. Verify Transition to Verify OTP (No URL change)
    await expect(page).toHaveURL("/forgot-password");
    await expect(page.getByText("Enter Verification Code")).toBeVisible();

    // 4. Enter OTP
    // Click the first slot or the container to focus
    await page.getByRole("textbox").click();
    await page.keyboard.type("123456");

    // 5. Submit OTP
    await page.getByRole("button", { name: "Verify Code" }).click();

    // 6. Verify Transition to Reset Password (No URL change)
    await expect(page).toHaveURL("/forgot-password");
    await expect(
      page.getByRole("heading", { name: "Reset Password" }),
    ).toBeVisible();

    // 7. Enter New Password
    await page.getByLabel("New Password").fill("newpassword123");
    await page.getByLabel("Confirm Password").fill("newpassword123");

    // 8. Submit Reset
    // Mock Reset Password
    await page.route(/\/auth\/reset-password/, async (route) => {
      await route.fulfill({
        status: 200,
        json: { status: true, message: "Password reset successfully" },
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    });

    await page.getByRole("button", { name: "Reset Password" }).click();

    // 9. Verify Redirect to Login
    await expect(page).toHaveURL("/");
  });
});
