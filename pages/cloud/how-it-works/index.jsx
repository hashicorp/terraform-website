import s from './style.module.css'
import TerraformHero from 'components/terraform-hero'
import ContentSection from 'components/content-section'
import TextSplitWithCode from '@hashicorp/react-text-split-with-code'
import TextSplitWithImage from '@hashicorp/react-text-split-with-image'
import LinkListCTA from 'components/link-list-cta'
// Imports below are only used in getStaticProps
import loadCodeSamples from 'util/load-code-samples'

export default function HowCloudWorksPage({ codeSamples }) {
  return (
    <div>
      <div className={s.howCloudWorksHero}>
        <TerraformHero
          title="How Terraform Cloud Works"
          description="Terraform Cloud provides remote operations for Terraform, and is ideal for production and team environments. Learn how Terraform Cloud works across your organization."
        />
      </div>

      <ContentSection className={s.howCloudWorksContent}>
        <TextSplitWithCode
          textSplit={{
            textSide: 'right',
            heading: 'Write',
            content: (
              <p>
                Create new infrastructure using <a href="/language/">HCL</a>, or
                manage existing infrastructure that you’ve already written using
                Terraform Open Source. Terraform Cloud works with any of the
                latest versions of Terraform. You can also leverage hundreds of
                providers and thousands of pre-written modules in the{' '}
                <a href="https://registry.terraform.io">Terraform Registry</a>.
              </p>
            ),
          }}
          codeBlock={{
            options: { showChrome: true },
            ...codeSamples['write-example.hcl'],
          }}
        />
        <TextSplitWithImage
          textSplit={{
            textSide: 'right',
            heading: 'Compose',
            content: (
              <p>
                <a href="/cloud-docs/workspaces/">Workspaces</a> provide an
                environment for a collection of infrastructure. They store
                variables, state files, credentials, and secrets. Connect a
                workspace to a Terraform configuration stored locally, in
                version control, or uploaded via an API. Then, connect that
                workspace to the cloud services where you would like
                infrastructure to be provisioned.
              </p>
            ),
          }}
          image={{
            url: require('./img/compose.jpg?url'),
            alt: 'Compose diagram',
          }}
        />
        <TextSplitWithImage
          textSplit={{
            className: 'g-text-split',
            textSide: 'right',
            heading: 'Plan',
            content: (
              <p>
                Terraform Cloud provides a <a href="/cli/commands/plan">plan</a>{' '}
                for infrastructure changes before every run. It can{' '}
                <a href="/cloud-docs/cost-estimation">calculate costs</a> for
                this plan, and cross check it with any policy as code your
                security and compliance teams create using{' '}
                <a href="/cloud-docs/sentinel">Sentinel</a>.
              </p>
            ),
          }}
          image={{ url: require('./img/plan.jpg?url'), alt: 'Plan diagram' }}
        />
        <TextSplitWithImage
          textSplit={{
            textSide: 'right',
            heading: 'Provision & Manage',
            content: (
              <p>
                Instead of relying on your team’s local machines to execute
                runs, provision and manage infrastructure reliably and securely
                with{' '}
                <a href="/cloud-docs/run/run-environment">
                  Terraform Cloud’s run environment
                </a>
                . Integrate Terraform Cloud into your existing CI/CD pipeline
                and other tools you already use.
              </p>
            ),
          }}
          image={{
            url: require('./img/provision-manage.jpg?url'),
            alt: 'Provision and Manage diagram',
          }}
        />
        <TextSplitWithImage
          textSplit={{
            textSide: 'right',
            heading: 'Collaborate & Share',
            content: (
              <p>
                Provide{' '}
                <a href="https://www.hashicorp.com/products/terraform/self-service-infrastructure">
                  self-service infrastructure
                </a>{' '}
                and a run environment for an entire organization using your own{' '}
                <a href="/cloud-docs/registry/">private module registry</a> and{' '}
                <a href="/cloud-docs/users-teams-organizations/permissions">
                  workspace permissions
                </a>
                . Developers can provision their own infrastructure using your
                team’s private modules, which standardize best practices across
                your organization.
              </p>
            ),
          }}
          image={{
            url: require('./img/collaborate-share.jpg?url'),
            alt: 'Collaborate and Share diagram',
          }}
        />
      </ContentSection>

      <LinkListCTA
        heading="Start collaborating with Terraform"
        links={[
          {
            text: 'Sign up for free',
            url:
              'https://app.terraform.io/signup/account?utm_source=terraform_io&utm_content=terraform_cloud_footer',
          },
          {
            text: 'Explore plans',
            url: 'https://www.hashicorp.com/products/terraform/pricing',
          },
          {
            text: 'Get started with a tutorial',
            url:
              'https://learn.hashicorp.com/collections/terraform/cloud-get-started?utm_source=terraform_io&utm_content=terraform_cloud_footer',
          },
        ]}
      />
    </div>
  )
}

export async function getStaticProps() {
  const codeSamples = await loadCodeSamples(
    'pages/cloud/how-it-works/code-samples'
  )
  return { props: { codeSamples } }
}
