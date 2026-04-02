import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "npm run build && python3 -m http.server 4173 -d dist",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120000
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "iphone-12",
      use: { ...devices["iPhone 12"] }
    },
    {
      name: "pixel-7",
      use: { ...devices["Pixel 7"] }
    }
  ]
});
