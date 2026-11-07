import { expect, test } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

if (!email || !password) {
  throw new Error("Set E2E_USER_EMAIL and E2E_USER_PASSWORD to a dedicated, onboarded test account.");
}

test("authenticated step and weight logs persist after a reload", async ({ page }) => {
  await page.goto("/");

  const signInTab = page.getByRole("button", { name: "Sign in", exact: true }).first();
  if (await signInTab.isVisible()) await signInTab.click();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).last().click();
  await expect(page.getByRole("button", { name: "Overview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your overview" })).toBeVisible();

  const steps = 20000 + Math.floor(Math.random() * 80000);
  const weight = (50 + Math.random() * 100).toFixed(1);
  await page.getByRole("button", { name: "Progress" }).click();
  await page.getByRole("spinbutton", { name: "Steps today" }).fill(String(steps));
  await page.getByRole("button", { name: "Save steps" }).click();
  await expect(page.getByText(`${steps.toLocaleString()} steps`).first()).toBeVisible();
  await page.getByRole("spinbutton", { name: "Weight in kg" }).fill(weight);
  await page.getByRole("button", { name: "Log weight" }).click();
  await expect(page.getByText(`${weight} kg`).first()).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Overview" })).toBeVisible();
  await page.getByRole("button", { name: "Progress" }).click();
  await expect(page.getByRole("spinbutton", { name: "Steps today" })).toHaveValue(String(steps));
  await expect(page.getByRole("spinbutton", { name: "Weight in kg" })).toHaveValue(weight);
  await expect(page.getByText("Recent activity")).toBeVisible();
});
