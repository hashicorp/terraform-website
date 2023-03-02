import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { StandaloneLinkProps } from './types'
import s from './standalone-link.module.css'

/* Copied from devdot https://github.com/hashicorp/dev-portal/tree/main/src/components/standalone-link */

const StandaloneLink = ({
  ariaLabel,
  className,
  color = 'primary',
  download,
  href,
  icon,
  iconPosition,
  onClick,
  openInNewTab = false,
  size = 'medium',
  text,
  textClassName,
}: StandaloneLinkProps): ReactElement => {
  const classes = classNames(s.root, s[`color-${color}`], s[size], className)
  const rel = openInNewTab ? 'noreferrer noopener' : undefined
  const target = openInNewTab ? '_blank' : '_self'

  return (
    (<Link
      href={href}
      aria-label={ariaLabel}
      className={classes}
      download={download}
      onClick={onClick}
      rel={rel}
      target={target}>
      {/**
       * NOTE: this markup is valid. It's OK to have an `onClick` when there is
       * also an `href` present. The `jsx-a11y/anchor-is-valid` rule is not
       * seeing this though since the `href` attribute is being set on `Link`
       * rather than the `<a>`.
       */}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}

      {iconPosition === 'leading' && icon}
      <span className={classNames(s.text, textClassName)}>{text}</span>
      {iconPosition === 'trailing' && icon}

    </Link>)
  );
}

export type { StandaloneLinkProps }
export default StandaloneLink
