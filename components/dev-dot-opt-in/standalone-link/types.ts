import { ReactElement } from 'react'
import type { LinkProps } from 'next/link'

type AnchorElementProps = JSX.IntrinsicElements['a']

export interface StandaloneLinkProps {
  /**
   * A non-visible label presented by screen readers. Passed directly to the
   * internal link element as the `aria-label` prop.
   *
   * ref: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
   */
  ariaLabel?: AnchorElementProps['aria-label']

  /**
   * A string of one or more class names. Applied last to the rendered `<a>`
   * element.
   */
  className?: AnchorElementProps['className']

  /**
   * Determines the set of colors to use for various states of the component.
   */
  color?: 'primary' | 'secondary'

  /**
   * Same as the <a> element's download prop. Passed directly to the internal
   * link element.
   *
   * ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download
   */
  download?: AnchorElementProps['download']

  /**
   * The destination of the link.
   */
  href: LinkProps['href']

  /**
   * An icon from `@hashicorp/flight-icons` to render.
   *
   * Example:
   *
   * ```jsx
   * import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
   *
   * const MyComponent = () => {
   *  return (
   *    <StandaloneLink
   *      href="/"
   *      icon={<IconArrowRight16 />}
   *      iconPosition="trailing"
   *      text="Get Started"
   *    />
   *  )
   * }
   * ```
   */
  icon: ReactElement

  /**
   * Where the icon should be rendered within the link.
   */
  iconPosition: 'leading' | 'trailing'

  /**
   * A callback function to invoke when the `<a>` element  clicked.
   */
  onClick?: AnchorElementProps['onClick']

  /**
   * Whether or not the link should open in a new tab. Affects the `target` and
   * `rel` props passed to the internally rendered `<a>` element.
   */
  openInNewTab?: boolean

  /**
   * The size of the rendered link, which mainly affects the font-size and
   * line-height CSS properties.
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * The text rendered within the `<a>` element.
   */
  text: string

  /**
   * Optional className to apply to `text`'s wrapper element.
   */
  textClassName?: string
}
