import s from './style.module.css'

export default function ContentSection({ theme, className, children }) {
  return (
    <div
      className={
        s.contentSection +
        (theme ? ` ${s[theme]}` : '') +
        (className ? ` ${className}` : '')
      }
    >
      {children}
    </div>
  )
}
