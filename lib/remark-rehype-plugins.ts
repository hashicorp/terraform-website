import {
  includeMarkdown,
  paragraphCustomAlerts,
  typography,
  anchorLinks,
} from '@hashicorp/remark-plugins'
// Code highlighting
import rehypePrism from '@mapbox/rehype-prism'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'

export const remarkPlugins: $TSFixMe[] = [
  includeMarkdown,
  paragraphCustomAlerts,
  typography,
  anchorLinks,
]

export const rehypePlugins: $TSFixMe[] = [
  [rehypePrism, { ignoreMissing: true }],
  rehypeSurfaceCodeNewlines,
]
