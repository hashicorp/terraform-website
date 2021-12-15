import InfoGrid from 'components/info-grid'
import HomepageSection from 'components/homepage-section'
import styles from './style.module.css'
import Button from '@hashicorp/react-button'
import TextSplitWithImage from '@hashicorp/react-text-split-with-image'
import SteppedFeatureList from '@hashicorp/react-stepped-feature-list'
import TextSplitWithCode from '@hashicorp/react-text-split-with-code'
import TerraformHero from 'components/terraform-hero'
import CodeBlock from '@hashicorp/react-code-block'
// Imports below are only used in getStaticProps
import loadCodeSamples from 'util/load-code-samples'
import { productSlug } from 'data/metadata'

export default function HomePage({ codeSamples }) {
  return (
    <div>
      <TerraformHero
        alert={{
          url:
            'https://www.hashicorp.com/blog/announcing-hashicorp-terraform-1-0-general-availability',
          text: 'Read the 1.0 launch blog post',

          tag: 'Blog post',
        }}
        title="Write, Plan, Apply"
        description="Terraform is an open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services. Terraform codifies cloud APIs into declarative configuration files."
        links={[
          {
            title: 'Get started',
            url:
              'https://learn.hashicorp.com/terraform?utm_source=terraform_io&utm_content=terraform_io_hero',
            external: true,
          },
        ]}
        uiVideo={{
          name: '',
          url: '/videos/oss-cli-demo.mp4',
          srcType: 'mp4',
          playbackRate: 2,
        }}
      />

      <div className={styles.splitSection}>
        <h2 className="g-type-display-2">Deliver Infrastructure as Code</h2>
        <TextSplitWithCode
          textSplit={{
            className: 'g-text-split',
            heading: 'Write',
            textSide: 'left',
            content:
              'Write infrastructure as code using declarative configuration files. HashiCorp Configuration Language (HCL) allows for concise descriptions of resources using blocks, arguments, and expressions.',
          }}
          codeBlock={{
            options: { showChrome: true },
            ...codeSamples['write-infra.hcl'],
          }}
        />
        <TextSplitWithCode
          textSplit={{
            className: 'g-text-split',
            heading: 'Plan',
            textSide: 'right',
            content: (
              <p className="g-type-body">
                Run <code>terraform plan</code> to check whether the execution
                plan for a configuration matches your expectations before
                provisioning or changing infrastructure.
              </p>
            ),
          }}
          codeBlock={{
            options: { showChrome: true },
            ...codeSamples['plan-infra.shell-session'],
          }}
        />
        <TextSplitWithImage
          textSplit={{
            className: 'g-text-split',
            heading: 'Apply',
            textSide: 'left',
            content: (
              <p className="g-type-body">
                Apply changes to hundreds of cloud providers with{' '}
                <code>terraform apply</code> to reach the desired state of the
                configuration.
              </p>
            ),
          }}
          image={{
            url: require('./img/cloud-providers.png'),
            alt: '',
          }}
        />
      </div>
      <HomepageSection title="Features" theme="gray">
        <SteppedFeatureList
          product={productSlug}
          features={[
            {
              title: 'Write declarative config files',
              description:
                'Define infrastructure as code to manage the full lifecycle — create new resources, manage existing ones, and destroy those no longer needed.',
              learnMoreLink: '/language',
              content: <CodeBlock {...codeSamples['hcl-config.hcl']} />,
            },
            {
              title: 'Installable modules',
              description: (
                <>
                  Automatically download and install community or partner
                  modules from the registry with <code>terraform init</code>
                </>
              ),
              learnMoreLink: '/language/modules/develop',
              content: (
                <CodeBlock {...codeSamples['install-modules.shell-session']} />
              ),
            },
            {
              title: 'Plan and predict changes',
              description:
                'Terraform allows operators to safely and predictably make changes to infrastructure, with clearly mapped resource dependencies and separation of plan and apply.',
              learnMoreLink: '/cli/commands/plan',
              content: (
                <CodeBlock {...codeSamples['plan-and-predict.shell-session']} />
              ),
            },
            {
              title: 'Dependency graphing',
              description: (
                <>
                  Easily generate <code>terraform plan</code>, refresh state,
                  and more, with Terraform config dependency graphing.
                </>
              ),
              learnMoreLink: '/internals/graph',
              content: (
                <img
                  src={require('./img/dependency-graphing.png')}
                  alt="Dependency graphing"
                />
              ),
            },
            {
              title: 'State management',
              description:
                'Map real world resources to your configuration, keep track of metadata, and improve performance for large infrastructures.',
              learnMoreLink: '/language/state/purpose',
              content: <CodeBlock {...codeSamples['state-management.json']} />,
            },
            {
              title: 'Provision infrastructure in familiar languages',
              description:
                'CDK for Terraform (experimental) allows you to define infrastructure code in TypeScript, Python, Java, C#, and Go, using the 1000+ existing Terraform providers and HCL Terraform modules.',
              learnMoreLink:
                'https://learn.hashicorp.com/tutorials/terraform/cdktf',
              content: (
                <img
                  src={require('./img/cdk-for-terraform.png')}
                  alt="Terraform CDK"
                />
              ),
            },
            {
              title: 'Terraform Registry with 1000+ providers',
              description:
                'Choose from an array of providers for your cloud platforms and services, add them to your configuration, then use their resources to provision infrastructure.',
              learnMoreLink: 'https://registry.terraform.io/',
              content: (
                <img
                  src={require('./img/registry-1000.svg')}
                  alt="Terraform Registry Providers"
                />
              ),
            },
          ]}
        />
      </HomepageSection>
      <HomepageSection title="Why Terraform" padTop>
        <InfoGrid
          items={[
            {
              icon: require('./img/why-terraform/code.svg'),
              title: 'Codify your application infrastructure',
              description:
                'Reduce human error and increase automation by provisioning infrastructure as code.',
            },
            {
              icon: require('./img/why-terraform/layers.svg'),
              title: 'Manage infrastructure across clouds',
              description:
                'Provision infrastructure across 300+ public clouds and services using a single workflow.',
            },
            {
              icon: require('./img/why-terraform/refresh-ccw.svg'),
              title: 'Create reproducible infrastructure',
              description:
                'Provision consistent testing, staging, and production environments with the same configuration.',
            },
          ]}
        />
      </HomepageSection>
      <TextSplitWithImage
        textSplit={{
          className: 'g-text-split',
          textSide: 'left',
          heading: 'How Terraform Works',
          content:
            'Terraform allows infrastructure to be expressed as code in a simple, human readable language called HCL (HashiCorp Configuration Language). It reads configuration files and provides an execution plan of changes, which can be reviewed for safety and then applied and provisioned. \n \nExtensible providers allow Terraform to manage a broad range of resources, including IaaS, PaaS, SaaS, and hardware services.',
        }}
        image={{
          url: require('./img/how-tf-works-2.png'),
          alt: 'How Terraform works',
        }}
      />
      <div className={styles.feedbackSection}>
        <h3 className="g-type-display-3">
          Are you using Terraform in production?
        </h3>
        <Button
          title="Share your success story and receive special Terraform swag."
          url="https://forms.gle/rAU5hRGpnjMArTjaA"
          theme={{
            brand: 'neutral',
            variant: 'tertiary-neutral',
            background: 'light',
          }}
          linkType="outbound"
        />
      </div>

      <HomepageSection>
        <div className={styles.communitySection}>
          <div>
            <iframe
              title="video"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/4BCR7Yx4k4o"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div>
            <h2 className="g-type-display-2">A strong community</h2>
            <ul className={styles.communitySectionList}>
              <li>450,000+ Commits</li>
              <li>4,000+ Modules</li>
              <li>1000+ Providers</li>
            </ul>
            <p>
              Open source projects benefit from the scrutiny of a broad and
              diverse user base. Keeping the code available helps empower the
              community of users while also providing an easy mechanism for
              feedback, improvement, and customization.
            </p>
          </div>
        </div>
      </HomepageSection>
      <HomepageSection title="Get Started">
        <div className={styles.getStartedSection}>
          <div>
            <h4 className="g-type-display-4">Terraform Open Source</h4>
            <Button
              title="Get Started"
              linkType="inbound"
              url="https://learn.hashicorp.com/collections/terraform/aws-get-started?utm_source=terraform_io&utm_content=terraform_io_footer"
              theme={{
                variant: 'tertiary-neutral',
                brand: 'terraform',
              }}
            />
            <Button
              title="Explore documentation"
              linkType="inbound"
              url="/intro"
              theme={{
                variant: 'tertiary-neutral',
                brand: 'terraform',
              }}
            />
          </div>
          <div>
            <h4 className="g-type-display-4">Terraform Cloud</h4>
            <Button
              title="Create Account / Sign In"
              linkType="inbound"
              url="https://app.terraform.io/signup/account?utm_source=terraform_io&utm_content=terraform_io_footer"
              theme={{
                variant: 'tertiary-neutral',
                brand: 'terraform',
              }}
            />
            <Button
              title="Get Started"
              linkType="inbound"
              url="https://learn.hashicorp.com/collections/terraform/cloud-get-started?utm_source=terraform_io&utm_content=terraform_io_footer"
              theme={{
                variant: 'tertiary-neutral',
                brand: 'terraform',
              }}
            />
            <Button
              title="Explore Documentation"
              linkType="inbound"
              url="/cloud-docs"
              theme={{
                variant: 'tertiary-neutral',
                brand: 'terraform',
              }}
            />
          </div>
          <div>
            <h4 className="g-type-display-4">Terraform Enterprise</h4>
            <Button
              title="Explore Documentation"
              linkType="inbound"
              url="/enterprise"
              theme={{
                variant: 'tertiary-neutral',
                brand: 'terraform',
              }}
            />
            <Button
              title="Check Pricing"
              linkType="inbound"
              url="https://www.hashicorp.com/products/terraform/editions/enterprise"
              theme={{
                variant: 'tertiary-neutral',
                brand: 'terraform',
              }}
            />
          </div>
        </div>
      </HomepageSection>
    </div>
  )
}

export async function getStaticProps() {
  const codeSamples = await loadCodeSamples('pages/home/code-samples')
  return { props: { codeSamples } }
}
