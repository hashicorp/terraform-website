import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { IconAlertCircleFill16 } from '@hashicorp/flight-icons/svg-react/alert-circle-fill-16'
import s from './dev-dot-opt-in.module.css'

const DAYS_UNTIL_EXPIRE = 180

const getDevDotLink = (product, path) => {
  const pathWithoutLeadingSlash = path.slice(1) // remove leading slash
  const url = new URL(
    `/${product}/${pathWithoutLeadingSlash}`,
    'https://developer.hashicorp.com'
  )
  url.searchParams.set('optInFrom', `${product}-io`)

  return url.toString()
}

/**
 * Largely copied from: https://github.com/hashicorp/learn/pull/4480
 */
export default function DevDotOptIn() {
  const { asPath } = useRouter()

  function handleOptIn() {
    // Set a cookie to ensure any future navigation will send them to dev dot
    Cookies.set(`terraform-io-beta-opt-in`, true, {
      expires: DAYS_UNTIL_EXPIRE,
    })
  }

  return (
    <div className={s.container}>
      <IconAlertCircleFill16 className={s.icon} />
      <p className={s.alert}>
        The Terraform website is being redesigned to help you find what you are
        looking for more effectively.
        <a
          className={s.optInLink}
          href={getDevDotLink('terraform', asPath)}
          onClick={handleOptIn}
        >
          Join the Beta
        </a>
      </p>
    </div>
  )
}
