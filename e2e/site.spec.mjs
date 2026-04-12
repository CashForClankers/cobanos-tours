import { expect, test } from "@playwright/test";

test("primary booking flow is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Los Cóbanos Local Guide/i);
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

test("focused guides and spanish page are reachable", async ({ page }) => {
  await page.goto("/");

  const whatToDoLinks = page.locator('a[href="what-to-do-in-los-cobanos.html"]');
  await expect(whatToDoLinks.first()).toBeVisible();
  await whatToDoLinks.first().click();
  await expect(page).toHaveURL(/what-to-do-in-los-cobanos\.html$/);
  await expect(page.getByRole("heading", { name: /What actually makes Los Cóbanos worth the stop/i })).toBeVisible();

  await page.goto("/");
  const dayTripLinks = page.locator('a[href="los-cobanos-day-trip-from-san-salvador.html"]');
  await expect(dayTripLinks.first()).toBeVisible();
  await dayTripLinks.first().click();
  await expect(page).toHaveURL(/los-cobanos-day-trip-from-san-salvador\.html$/);
  await expect(page.getByRole("heading", { name: /Plan a Los Cóbanos Nature Day from San Salvador/i })).toBeVisible();

  await page.goto("/");
  const naturalHistoryLinks = page.locator('a[href="los-cobanos-natural-history.html"]');
  await expect(naturalHistoryLinks.first()).toBeVisible();
  await naturalHistoryLinks.first().click();
  await expect(page).toHaveURL(/los-cobanos-natural-history\.html$/);
  await expect(page.getByRole("heading", { name: /Why Los Cóbanos feels different/i })).toBeVisible();

  await page.goto("/es/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { name: /Explora Los Cóbanos con Víctor/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: /Principal/i }).getByRole("link", { name: "English" })).toBeVisible();
  await page.getByRole("link", { name: /Historia natural/i }).last().click();
  await expect(page).toHaveURL(/es\/historia-natural\.html$/);
  await expect(page.getByRole("heading", { name: /Por qué Los Cóbanos se siente distinto/i })).toBeVisible();
});
