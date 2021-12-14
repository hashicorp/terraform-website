import styles from './NavBack.module.css'
import ArrowLeft from './images/arrow-left.svg'

export default function NavBack({ text, url }) {
  return (
    <a className={styles.navBack} href={url}>
      <img src={ArrowLeft} />
      {text}
    </a>
  )
}
