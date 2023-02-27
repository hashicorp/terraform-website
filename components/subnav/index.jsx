import Subnav from '@hashicorp/react-subnav'
import Link from 'next/link'
import { useFlagBag } from 'flags/client'

export default function DefaultSubnav({ menuItems }) {
  const flagBag = useFlagBag()
  
  return (
    <Subnav
      hideGithubStars={true}
      titleLink={{ text: 'HashiCorp Terraform', url: '/' }}
      ctaLinks={[
        { text: 'GitHub', url: 'https://github.com/hashicorp/terraform' },
        {
          text: 'Download',
          url: 'https://developer.hashicorp.com/terraform/downloads',
        },
        {
          text: flagBag.settled && flagBag.flags.tryForFree ? 'Try for Free' : 'Try Terraform Cloud',
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
