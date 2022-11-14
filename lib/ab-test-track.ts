import { isInUS } from '@hashicorp/platform-util/geo'

export const abTestTrack = ({
  type,
  test_name,
  variant,
}: {
  type: 'Served' | 'Result'
  test_name: string
  variant: string
}) => {
  if (
    typeof window !== 'undefined' &&
    window.analytics &&
    window.analytics.track &&
    typeof window.analytics.track === 'function' &&
    isInUS()
  ) {
    window.analytics.track(`AB Test ${type}`, {
      test_name,
      variant,
    })
  }
}
