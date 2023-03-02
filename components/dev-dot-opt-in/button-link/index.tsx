import Link from 'next/link'
import classNames from 'classnames'
import { ButtonLinkProps } from './types'
import s from './button-link.module.css'

/**
 * _Note WIP Component_
 * this button link component should mimic the design system options
 * outlined in `Button` component. This is a WIP implementation and should be
 * expanded upon. It currently renders a theme colors and sizes, with styles
 * copied from `Button`.
 **/
const ButtonLink = ({
  'aria-label': ariaLabel,
  color = 'primary',
  href,
  icon,
  iconPosition = 'leading',
  openInNewTab = false,
  size = 'medium',
  text,
  className,
  onClick,
}: ButtonLinkProps) => {
  const hasIcon = !!icon
  const hasText = !!text
  const hasLabel = !!ariaLabel
  const hasLeadingIcon = hasIcon && iconPosition === 'leading'
  const hasTrailingIcon = hasIcon && iconPosition === 'trailing'
  const isIconOnly = hasIcon && !hasText

  if (!hasIcon && !hasText) {
    throw new Error(
      '`ButtonLink` must have either `text` or an `icon` with accessible labels.'
    )
  }

  if (isIconOnly && !hasLabel) {
    throw new Error(
      'Icon-only `ButtonLink`s require an accessible label. Either provide the `text` prop, or `ariaLabel`.'
    )
  }

  return (
    (<Link
      href={href}
      aria-label={ariaLabel}
      className={classNames(s.root, s[size], s[color], className)}
      rel={openInNewTab ? 'noreferrer noopener' : undefined}
      target={openInNewTab ? '_blank' : '_self'}
      onClick={onClick}>
      {/**
       * copied from components/standalone-link
       * NOTE: this markup is valid. It's OK to have an `onClick` when there is
       * also an `href` present. The `jsx-a11y/anchor-is-valid` rule is not
       * seeing this though since the `href` attribute is being set on `Link`
       * rather than the `<a>`.
       */}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}

      {hasLeadingIcon && icon}
      {hasText ? text : null}
      {hasTrailingIcon && icon}

    </Link>)
  );
}

export default ButtonLink
