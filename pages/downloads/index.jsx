import semverGte from 'semver/functions/gte'
import semverSatisfies from 'semver/functions/satisfies'
import VERSION from 'data/version'
import { productSlug } from 'data/metadata'
import Logo from '@hashicorp/mktg-assets/dist/product/terraform-logo/color'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import Button from '@hashicorp/react-button'
import { generateStaticProps } from '@hashicorp/react-product-downloads-page/server'
import s from './style.module.css'

const VERSION_DOWNLOAD_CUTOFF = '1.0.11'

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
            theme={{ variant: 'tertiary', brand: 'terraform' }}
          />
        </div>
      }
      {...staticProps}
    />
  )
}

function filterOldVersions(props) {
  if (!props?.props?.releases?.versions) return props

  const versions = props.props.releases.versions

  // versions is in the form of { [version]: { ...metadata } }
  const filteredVersions = Object.entries(versions).filter(([version]) => {
    if (!semverGte(version, VERSION_DOWNLOAD_CUTOFF)) return false
    // We don't want to list these versions in the download dropdown as they have a critical bug
    if (semverSatisfies(version, '1.1.0 - 1.1.1')) return false

    return true
  })

  props.props.releases.versions = Object.fromEntries(filteredVersions)
}

export async function getStaticProps() {
  const props = await generateStaticProps({
    product: productSlug,
    latestVersion: VERSION,
  })

  filterOldVersions(props)

  return props
}
