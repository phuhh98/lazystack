import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            browser: {
              enabled: false,
            },
            environment: 'jsdom',
            include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
            name: 'unit',
            setupFiles: ['./src/tests/setup.ts'],
            typecheck: { enabled: true },
          },
        },
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
            }),
          ],
          test: {
            browser: {
              enabled: true,
              headless: true,
              instances: [
                {
                  browser: 'chromium',
                },
              ],
              provider: playwright({}),
            },
            include: [],
            name: 'storybook',
            // setupFiles: ['./.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
  }),
)
