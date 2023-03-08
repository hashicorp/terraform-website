import * as React from 'react'
import classNames from 'classnames'
import Subnav from '@hashicorp/react-subnav'
import { isInUS } from '@hashicorp/platform-util/geo'
import Link from 'next/link'
import { useFlagBag } from 'flags/client'
import s from './style.module.css'

export default function DefaultSubnav({ menuItems }) {
  const flagBag = useFlagBag()
  const renderVariant = React.useMemo(() => {
    return isInUS() && flagBag.settled && flagBag.flags?.tryForFree
  }, [flagBag])
  const classnames = classNames(s.subnav, flagBag.settled && s.settled)

  return (
    <Subnav
      className={classnames}
      hideGithubStars={true}
      titleLink={{ text: 'HashiCorp Terraform', url: '/' }}
      ctaLinks={[
        { text: 'GitHub', url: 'https://github.com/hashicorp/terraform' },
        {
          text: 'Download',
          url: 'https://developer.hashicorp.com/terraform/downloads',
        },
        {
          text: renderVariant ? 'Try for free' : 'Try Terraform Cloud',
          url: 'https://app.terraform.io/public/signup/account',
          theme: {
            brand: 'terraform',
          },
          onClick: () =>
            abTestTrack({
              type: 'Result',
              test_name: 'io-site primary CTA copy test 03-23',
              variant: renderVariant ? 'true' : 'false',
            }),
        },
      ]}
      menuItems={menuItems}
      menuItemsAlign="right"
      constrainWidth
      Link={Link}
    />
  )
}
