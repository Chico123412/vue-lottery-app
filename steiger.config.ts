import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'
export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      'fsd/insignificant-slice': 'off',
      'fsd/inconsistent-naming': 'off',
      'fsd/segments-by-purpose': 'off',
    },
  },
  { files: ['./src/shared/**'], rules: { 'fsd/public-api': 'off' } },
])
