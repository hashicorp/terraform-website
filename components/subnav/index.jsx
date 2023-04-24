import * as React from 'react'
import Subnav from '@hashicorp/react-subnav'
import Link from 'next/link'
import s from './style.module.css'

export default function DefaultSubnav({ menuItems }) {
  return (
    <Subnav
      className={s.subnav}
      hideGithubStars={true}
      titleLink={{ text: 'HashiCorp Terraform', url: '/' }}
      ctaLinks={[
        { text: 'GitHub', url: 'https://github.com/hashicorp/terraform' },
        {
          text: 'Download',
          url: 'https://developer.hashicorp.com/terraform/downloads',
        },
        {
          text: 'Try Terraform Cloud',
          url: 'https://app.terraform.io/public/signup/account',
          theme: {
            brand: 'terraform',
          },
        },
      ]}
      menuItems={menuItems}
      menuItemsAlign="right"
      constrainWidth
      Link={Link}
    />
  )
}
