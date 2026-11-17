import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /phase5-rooms\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3102",
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
  webServer: [
    {
      command: "pnpm --filter @tfi/realtime dev",
      port: 1999,
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: "ENABLE_ROOMS=true ENABLE_READY_CHECK=true pnpm start -p 3102",
      url: "http://127.0.0.1:3102/health",
      reuseExistingServer: false,
      timeout: 60000,
    },
  ],
});
