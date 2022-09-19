import DocsPage from '@hashicorp/react-docs-page'
import DevDotOptIn from 'components/dev-dot-opt-in'

export default function TerraformDocsPage(props) {
  return <DocsPage {...props} optInBanner={<DevDotOptIn />} />
}
