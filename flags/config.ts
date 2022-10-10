import type { Configuration } from '@happykit/flags/config'

// You can replace this with your exact flag types
export type AppFlags = { [key: string]: boolean | number | string | null }

export const config: Configuration<AppFlags> = {
  envKey: process.env.NEXT_PUBLIC_FLAGS_ENV_KEY!,

  // You can provide defaults flag values here
  defaultFlags: {
    testFlag: false,
  },
}
