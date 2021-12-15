import s from './style.module.css'
import TerraformHero from 'components/terraform-hero'
import ContentSection from 'components/content-section'
import CategorizedFeatureList from 'components/categorized-feature-list'
import LinkListCTA from 'components/link-list-cta'
import TextSplitWithImage from '@hashicorp/react-text-split-with-image'
import PageHeadTags from 'components/page-head-tags'

export default function CloudPage() {
  return (
    <div>
      <PageHeadTags
        titleOverride="Terraform Cloud by HashiCorp"
        descriptionOverride="Terraform Cloud helps teams use Terraform together and is available as a hosted service, with free and paid versions to fit an organization’s needs."
        tags={[
          // This is a hack to prevent PageHeadTags from throwing an error that no tags are passed
          { tag: 'title', content: 'HashiCorp' },
        ]}
      />

      <div className={s.cloudHero}>
        <TerraformHero
          alert={{
            url:
              'https://hashicorp.com/blog/announcing-controlled-remote-state-access-for-terraform-cloud-and-enterprise',
            text: 'Announcing Controlled Remote State Access',
            tag: 'Blog post',
          }}
          title="Terraform Cloud"
          description="The easiest way to use Terraform in production at any scale."
          links={[
            {
              title: 'Create account',
              url:
                'https://app.terraform.io/signup/account?utm_source=terraform_io&utm_content=terraform_cloud_hero',
              external: true,
            },
          ]}
          uiVideo={{
            url: '/videos/cloud-ui-demo.mp4',
            srcType: 'mp4',
            playbackRate: 2,
          }}
          cliVideo={{
            url: '/videos/cloud-cli-demo.mp4',
            srcType: 'mp4',
            playbackRate: 2,
          }}
        />
      </div>

      <ContentSection className={s.whyCloudContent}>
        <TextSplitWithImage
          textSplit={{
            className: 'g-text-split',
            heading: 'Why Terraform Cloud?',
            content: (
              <>
                <p>
                  Terraform Cloud is HashiCorp’s managed service offering that
                  eliminates the need for unnecessary tooling and documentation
                  to use Terraform in production.
                </p>
                <p>
                  Provision infrastructure securely and reliably in the cloud
                  with free remote state storage. As you scale, add workspaces
                  for better collaboration with your team.
                </p>
              </>
            ),
            links: [
              {
                text: 'Learn how Terraform Cloud works',
                url: '/cloud/how-it-works',
              },
            ],
          }}
          image={{
            url: require('./img/why-tf-cloud.png'),
            alt: 'How Terraform Cloud Works diagram',
          }}
        />
      </ContentSection>

      {/* TODO Finalize content */}
      <ContentSection className={s.featuresContent} theme="gray">
        <CategorizedFeatureList
          heading="A Terraform solution that scales with your team"
          categories={[
            {
              // TODO Export an SVG here
              image: { url: require('./img/devops-practitioner.png') },
              title: (
                <h3 className="g-type-display-3">
                  <strong>Build</strong>{' '}
                  <span>infrastructure with other DevOps practitioners.</span>
                </h3>
              ),
              description:
                'Run Terraform securely and remotely, and collaborate on infrastructure with your team.',
              features: [
                {
                  heading: 'Remote state storage',
                  content:
                    'Store your Terraform state file securely with encryption at rest. Track infrastructure changes over time, and restrict access to certain teams within your organization.',
                },
                {
                  heading: 'Flexible Workflows',
                  content:
                    'Run Terraform the way your team prefers. Execute runs from the CLI or a UI, your version control system, or integrate them into your existing workflows with an API.',
                },
                {
                  heading: 'Version Control (VCS) integration',
                  content:
                    'Use version control to store and collaborate on Terraform configurations. Terraform Cloud can automate a run as soon as a pull request is merged into a main branch.',
                },
                {
                  heading: 'Collaborate on infrastructure changes',
                  content:
                    'Facilitate collaboration on your team. Review and comment on plans prior to executing any change to infrastructure.',
                },
              ],
            },
            {
              image: { url: require('./img/standardize-practices.png') },
              title: (
                <h3 className="g-type-display-3">
                  <strong>Standardize</strong>{' '}
                  <span>best practices across your team.</span>
                </h3>
              ),
              description:
                'Help your team remain secure and compliant every time they make a change to infrastructure.',
              features: [
                {
                  heading: 'Private module registry',
                  content:
                    'Create blueprints for your infrastructure that can serve other teams. Set up a private module registry that stores all of your organization’s preferred modules.',
                },
                {
                  heading: 'Sentinel',
                  content:
                    'Create security and compliance guardrails for any Terraform run. Sentinel makes it possible to create hard and soft provisioning rules across your organization.',
                },
                {
                  heading: 'Cost estimation',
                  content:
                    'Control costs by calculating them before applying changes. Cost estimation shows the hourly and monthly costs behind any Terraform run, and budget policies can be enforced with Sentinel.',
                },
                {
                  heading: 'Custom workspace permissions',
                  content:
                    'Practice the Principle of Least Privilege for Terraform users. Set up different access levels for admins, DevOps operators, and developers consuming Terraform resources.',
                },
                {
                  heading: 'Single sign-on',
                  content:
                    'Onboard new users securely and efficiently. The Terraform Cloud Business tier integrates with Okta, AzureAD, or any other SAML 2.0 compliant Identity Provider allowing you to set up SSO in minutes across your organization.',
                },
                {
                  heading: 'Audit logs',
                  content:
                    'Analyze the state of your infrastructure over time. Export audit logs to external systems via an API, or export their outputs into Splunk for better visualization.',
                },
              ],
            },
            {
              image: { url: require('./img/ci-cd.png') },
              title: (
                <h3 className="g-type-display-3">
                  <strong>Innovate</strong>{' '}
                  <span>
                    by integrating Terraform into your existing CI/CD pipeline.
                  </span>
                </h3>
              ),
              description:
                'Automate Terraform Cloud functionality into the workflows your team uses everyday.',
              features: [
                {
                  heading: 'Helpful integrations',
                  content:
                    'Leverage out-of-the-box integrations with popular tools. Provision infrastructure instantly for a Kubernetes cluster, or enable self-service provisioning with ServiceNow.',
                },
                {
                  heading: 'CI/CD integration',
                  content:
                    'Integrate Terraform runs into your CI/CD pipeline. Advanced users can run Terraform in automation, with status checks from CircleCI or GitHub Actions.',
                },
                {
                  heading: 'API',
                  content:
                    'Build Terraform Cloud into existing and/or automated workflows. Control and integrate Terraform Cloud functionality using a robust REST API.',
                },
                {
                  heading: 'Notifications',
                  content:
                    'Integrate the status of Terraform runs into other systems. Send notifications via email, Slack, or via webhooks when a Terraform run is completed.',
                },
                {
                  heading: 'Private datacenter connectivity',
                  content:
                    'Manage resources in your organization’s private data center. Business tier customers can use remote agents to manage both public and private resources.',
                },
                {
                  heading: 'Concurrent runs',
                  content:
                    'Increase your team’s velocity by adding concurrent runs. Governance and Business tier customers can execute multiple runs at the same time.',
                },
              ],
            },
          ]}
        />
      </ContentSection>

      <LinkListCTA
        heading="Start collaborating with Terraform"
        background="white"
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
