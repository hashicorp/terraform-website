import type { Configuration } from '@happykit/flags/config'

// You can replace this with your exact flag types
export type AppFlags = { [key: string]: boolean | number | string | null }

export const config: Configuration<AppFlags> = {
  // see next.config.js for env var value
  envKey: process.env.HAPPY_KIT_KEY!,

  // You can provide defaults flag values here
  defaultFlags: {
    testFlag: false,
    ioHomeHeroCtas: false,
  },
}
