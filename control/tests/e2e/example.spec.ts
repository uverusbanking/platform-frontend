import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  // Using the H1 text we found in app/(auth)/page.tsx
  await expect(
    page.getByRole("heading", { name: "Welcome to Uverus" }),
  ).toBeVisible();
  await expect(page.getByText("Admin Banking Infrastructure")).toBeVisible();
});

test("login form visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByLabel("Email Address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Authenticate Account" }),
  ).toBeVisible();
});
