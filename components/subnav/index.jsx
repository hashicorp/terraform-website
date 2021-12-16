import styles from './Subnav.module.css'
import Subnav from '@hashicorp/react-subnav'
import NavBack from 'components/nav-back'
import Link from 'next/link'
import { useRouter } from 'next/router'
import navMenuItems from 'data/primary-navigation.js'
import TfcNavMenuItems from 'data/tfc-navigation.js'

/**
 * ProductSubnav is the primary exported "Subnav" component
 * that is responsible for determining which nav to show.
 *
 * We currently have two navigations: the default nav, and
 * a navigation specifically for the /cloud pages. Based
 * off of our current page we instantiate the appropriate
 * nav here.
 */
export default function ProductSubnav() {
  const router = useRouter()
  return router.pathname.startsWith('/cloud') ? (
    <CloudSubnav />
  ) : (
    <DefaultSubnav />
  )
}

function DefaultSubnav() {
  return (
    <Subnav
      titleLink={{ text: 'terraform', url: '/' }}
      ctaLinks={[
        { text: 'Download CLI', url: '/downloads' },
        { text: 'Terraform Cloud', url: '/cloud' },
      ]}
      menuItems={navMenuItems}
      menuItemsAlign="right"
      constrainWidth
      Link={Link}
    />
  )
}

/**
 * The specific subnav for `/cloud*` pages.
 */
function CloudSubnav() {
  return (
    <>
      <Subnav
        titleLink={{ text: 'tfc', url: '/' }}
        ctaLinks={[
          {
            text: 'Sign in',
            url: 'https://app.terraform.io/session?utm_source=terraform_io&utm_content=terraform_cloud_top_nav',
          },
          {
            text: 'Create account',
            url: 'https://app.terraform.io/signup/account?utm_source=terraform_io&utm_content=terraform_cloud_top_nav',
          },
        ]}
        menuItems={TfcNavMenuItems}
        menuItemsAlign="right"
        constrainWidth
        Link={Link}
      />
      <div className={styles.navBackWrapper}>
        <NavBack text="Back to Terraform CLI" url="/" />
      </div>
    </>
  )
}
