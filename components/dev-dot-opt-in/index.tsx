import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { IconAlertCircle16 } from '@hashicorp/flight-icons/svg-react/alert-circle-16'
import s from './dev-dot-opt-in.module.css'
import ButtonLink from './button-link'

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

function handleOptIn() {
  // Set a cookie to ensure any future navigation will send them to dev dot
  Cookies.set(`terraform-io-beta-opt-in`, true, {
    expires: DAYS_UNTIL_EXPIRE,
  })
}

/**
 * Largely copied from: https://github.com/hashicorp/learn/pull/4480
 */
export default function DevDotOptIn() {
  const { asPath } = useRouter()

  return (
    <div className={s.root}>
      <div className={s.alertContainer}>
        <div className={s.icon}>
          <IconAlertCircle16 />
        </div>
        <div className={s.contentContainer}>
          <p className={s.title}>
            A new platform for documentation and tutorials is launching soon.
          </p>
          <p className={s.description}>
            We are migrating Terraform documentation into HashiCorp Developer,
            our new developer experience.
          </p>
          <div className={s.actions}>
            <ButtonLink
              href={getDevDotLink('terraform', asPath)}
              text="Join Now"
              onClick={handleOptIn}
              color="secondary"
              size="small"
            />
            {/* commenting until blog post is published */}
            {/* <StandaloneLink
              icon={<IconArrowRight16 />}
              iconPosition="trailing"
              text="Learn More"
              href=""
              color="secondary"
              size="small"
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
