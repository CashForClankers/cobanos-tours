import { expect, test } from "@playwright/test";

test("primary booking flow is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Los Cóbanos Tours/i);
  await expect(page.locator("#hero-title")).toBeVisible();
  await expect(page.getByRole("link", { name: /Book with Victor|Reservar con Víctor/i }).first()).toBeVisible();
  await expect(page.locator(".stat-num", { hasText: "21,312" })).toBeVisible();

  const whatsappLinks = page.locator('a[href="https://wa.me/50364441869"]');
  await expect(whatsappLinks.first()).toBeVisible();
  await expect(page.locator('a[href="tel:+50364441869"]').first()).toBeVisible();
});

test("language switch exposes Spanish content and updates document language", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Cambiar a español/i }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { name: /Explora Los Cóbanos con Víctor/i })).toBeVisible();
  await expect(page.getByText(/Punto de encuentro/i).first()).toBeVisible();
});

test("wildlife resources and meeting point remain reachable", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Snorkeling and whale-watching notes|Notas de snorkel/i })).toBeVisible();
  await expect(page.locator('a[href*="inaturalist.org/observations"]').first()).toBeVisible();
  await expect(page.locator('a[href*="inaturalist.org/observations"]')).toHaveCount(3);

  const mapSection = page.locator("#map");
  await mapSection.scrollIntoViewIfNeeded();
  await expect(page.locator("#map-title")).toBeVisible();
  await expect(mapSection.getByText("13.5254549, -89.8061826").first()).toBeVisible();
  await expect(mapSection.getByRole("link", { name: /Confirm with Victor|Confirmar con Víctor/i })).toBeVisible();
});
