import Subnav from '@hashicorp/react-subnav'
import Link from 'next/link'

export default function DefaultSubnav({ menuItems }) {
  return (
    <Subnav
      hideGithubStars={true}
      titleLink={{ text: 'HashiCorp Terraform', url: '/' }}
      ctaLinks={[
        { text: 'GitHub', url: 'https://github.com/hashicorp/terraform' },
        {
          text: 'Download',
          url: '/downloads',
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
