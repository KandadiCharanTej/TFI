import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: process.env.CI ? undefined : "chrome",
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["iPhone 13"],
      },
    },
  ],
  webServer: {
    command: "pnpm start -p 3100",
    url: "http://127.0.0.1:3100/health",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
