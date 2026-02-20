// @ts-expect-error - Ignoring the error of missing types for the uno config
import config from '@slidev/client/uno.config'
import { mergeConfigs, presetAttributify, presetIcons, presetWebFonts, presetWind } from 'unocss'

export default mergeConfigs([
  config,
  {
    rules: [
      ['font-rounded', { 'font-family': 'Comfortaa, cursive' }],
    ],
    safelist: [
      ...Array.from({ length: 30 }, (_, i) => `delay-${(i + 1) * 100}`),
    ],
    presets: [
      presetWind({
        dark: 'class',
      }),
      presetAttributify(),
      presetIcons(),
      presetWebFonts({
        fonts: {
          sans: 'DM Sans',
          cn: 'Noto Sans SC',
          mono: 'Fira Code',
          rounded: 'Comfortaa',
        },
        timeouts: {
          failure: 30000,
          warning: 30000,
        },
      }),
    ],
  },
])
