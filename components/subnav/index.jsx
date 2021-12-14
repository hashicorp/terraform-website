import styles from './Subnav.module.css'
import Subnav from '@hashicorp/react-subnav'
import NavBack from 'components/nav-back'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LegacyMobileNav from 'components/mobile-nav'
import LegacyNav from 'components/nav'

/**
 * ProductSubnav is the primary exported "Subnav" component
 * that is responsible for determining which nav to show.
 *
 * We currently have two navigations: the default nav (which has existed
 * on the site for a long time), and a navigation specifically for the
 * /cloud pages.  Based off of our current page we instantiate the appropriate
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

/**
 * DefaultSubnav is a simple wrapper around the 'Nav' component that's responsible
 * for setting the mobile stauts.
 */
function DefaultSubnav() {
  const [showMobile, setShowMobile] = useState(false)

  useEffect(() => {
    const sidebar = document.getElementById('sidebar-nav')
    const overlay = document.getElementById('sidebar-overlay')

    if (overlay) {
      overlay.addEventListener('click', () => setShowMobile(false))
    }
    if (sidebar && overlay) {
      if (showMobile) {
        sidebar.classList.add('open')
        overlay.classList.add('active')
      }
      if (!showMobile) {
        sidebar.classList.remove('open')
        overlay.classList.remove('active')
      }
    }
  }, [showMobile])

  return (
    <>
      <LegacyNav toggleMobile={() => setShowMobile(!showMobile)} />
      <LegacyMobileNav />
      <div id="sidebar-overlay" className={`sidebar-overlay`}></div>
    </>
  )
}

/**
 * The specific subnav for `/cloud*` pages.
 */
function CloudSubnav() {
  const router = useRouter()
  return (
    <>
      <Subnav
        titleLink={{
          text: 'tfc',
          url: '/cloud',
        }}
        ctaLinks={[
          {
            text: 'Sign in',
            url:
              'https://app.terraform.io/session?utm_source=terraform_io&utm_content=terraform_cloud_top_nav',
          },
          {
            text: 'Create account',
            url:
              'https://app.terraform.io/signup/account?utm_source=terraform_io&utm_content=terraform_cloud_top_nav',
          },
        ]}
        currentPath={router.pathname}
        menuItemsAlign="right"
        menuItems={[
          {
            text: 'Overview',
            url: '/cloud',
            type: 'inbound',
          },
          {
            text: 'How it Works',
            url: '/cloud/how-it-works',
            type: 'inbound',
          },
          {
            text: 'Pricing',
            url: 'https://www.hashicorp.com/products/terraform/pricing',
            type: 'outbound',
          },
          {
            text: 'Tutorials',
            url:
              'https://learn.hashicorp.com/collections/terraform/cloud-get-started?utm_source=terraform_io',
            type: 'outbound',
          },
          {
            text: 'Docs',
            url: '/cloud-docs',
            type: 'inbound',
          },
          {
            text: 'Registry',
            url: 'https://registry.terraform.io',
            type: 'outbound',
          },
          {
            text: 'Community',
            url: '/community',
            type: 'inbound',
          },
        ]}
        constrainWidth
      />
      <div className={styles.navBackWrapper}>
        <NavBack text="Back to Terraform CLI" url="/" />
      </div>
    </>
  )
}
