import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { prepareRoute } from "../test-helpers";

for (const pathname of ["/", "/install", "/docs"]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${pathname} ${theme} has no axe violations`, async ({ page }) => {
      await prepareRoute(page, pathname, theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
