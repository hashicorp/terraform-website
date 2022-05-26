import VERSION from 'data/version'
import { productSlug } from 'data/metadata'
import Logo from '@hashicorp/mktg-assets/dist/product/terraform-logo/color'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import Button from '@hashicorp/react-button'
import { generateStaticProps } from '@hashicorp/react-product-downloads-page/server'
import s from './style.module.css'
import filterVersions from 'lib/filter-versions'

const VERSION_DOWNLOAD_CUTOFF = '>=1.0.11'

export default function DownloadsPage(staticProps) {
  return (
    <ProductDownloadsPage
      getStartedDescription="Follow step-by-step tutorials on the essentials of Terraform."
      getStartedLinks={[
        {
          label: 'Get started with Terraform and AWS',
          href: 'https://learn.hashicorp.com/collections/terraform/aws-get-started?utm_source=terraform_io_download',
        },
        {
          label: 'Get started with Terraform and Microsoft Azure',
          href: 'https://learn.hashicorp.com/collections/terraform/azure-get-started?utm_source=terraform_io_download',
        },
        {
          label: 'Get started with Terraform and Google Cloud',
          href: 'https://learn.hashicorp.com/collections/terraform/gcp-get-started?utm_source=terraform_io_download',
        },
      ]}
      logo={<Logo width={126} height={36} className={s.logo} />}
      tutorialLink={{
        href: 'https://learn.hashicorp.com/terraform',
        label: 'View Tutorials at HashiCorp Learn',
      }}
      merchandisingSlot={
        <div className={s.hosting}>
          Want it hosted? Deploy on Terraform Cloud.
          <Button
            title="Sign up for Terraform Cloud"
            linkType="inbound"
            className={s.signUpButton}
            url="https://app.terraform.io/signup/account?utm_source=terraform_io_download&utm_content=download_cta"
            theme={{ variant: 'tertiary', brand: 'terraform' }}
          />
        </div>
      }
      {...staticProps}
    />
  )
}

export async function getStaticProps() {
  const props: $TSFixMe = await generateStaticProps({
    product: productSlug,
    latestVersion: VERSION,
  })

  // Filter versions based on VERSION_DOWNLOAD_CUTOFF
  const rawVersions = props.props?.releases?.versions
  const filteredVersions = filterVersions(rawVersions, VERSION_DOWNLOAD_CUTOFF)
  props.props.releases.versions = filteredVersions

  return props
}
