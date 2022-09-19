/**
 * All props the native <button> HTML element accepts
 */
type NativeButtonProps = JSX.IntrinsicElements['button']

/**
 * The native button props the Button component accepts.
 */
type PickedNativeButtonProps = Pick<
  NativeButtonProps,
  | 'aria-controls'
  | 'aria-describedby'
  | 'aria-expanded'
  | 'aria-label'
  | 'aria-labelledby'
  | 'className'
  | 'disabled'
  | 'form'
  | 'id'
  | 'name'
  | 'onClick'
  | 'type'
>

/**
 * Additional custom props the Button component accepts.
 */
interface ButtonProps extends PickedNativeButtonProps {
  /**
   * The name of the color to apply styles to the button. The default value is
   * "primary".
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'critical'

  /**
   * An icon from `@hashicorp/flight-icons` to render.
   *
   * Example:
   *
   * ```jsx
   * import { IconClipboardCopy16 } from '@hashicorp/flight-icons/svg-react/clipboard-copy-16'
   *
   * const MyComponent = () => {
   *  return (
   *    <Button
   *      icon={<IconClipboardCopy16 />}
   *      text="Copy to clipboard"
   *    />
   *  )
   * }
   * ```
   */
  icon?: JSX.IntrinsicElements['svg']

  /**
   * Where the icon should be rendered within the button. 'leading' will render
   * the icon before `text`, 'trailing' will render the icon after `text`. The
   * default value is "leading".
   */
  iconPosition?: 'leading' | 'trailing'

  /**
   * Whether or not the button should take up the full width of its container.
   * Buttons do not take up their container's full width by default.
   */
  isFullWidth?: boolean

  /**
   * The size of the button, which mainly affects font size and padding.
   * The default value is "medium".
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * The text to render inside of the button. This is not required for icon-only
   * buttons.
   */
  text?: string
}

export type { ButtonProps }

type AnchorElementProps = JSX.IntrinsicElements['a']

/**
 * The inherited props from Button.
 */
type PickedButtonProps = Pick<
  ButtonProps,
  | 'aria-label'
  | 'color'
  | 'icon'
  | 'iconPosition'
  | 'size'
  | 'text'
  | 'className'
>

/**
 * The additional custom props for ButtonLink.
 */
interface ButtonLinkProps extends PickedButtonProps {
  href: string
  openInNewTab?: boolean
  onClick?: AnchorElementProps['onClick']
}

export type { ButtonLinkProps }
