import VerticalTextBlockList from '@hashicorp/react-vertical-text-block-list'
import SectionHeader from '@hashicorp/react-section-header'
import Head from 'next/head'
import { productName, productSlug } from 'data/metadata'
import s from './style.module.css'

export default function CommunityPage() {
  return (
    <div className={s.root}>
      <Head>
        <title key="title">Community | {productName} by HashiCorp</title>
      </Head>
      <SectionHeader
        headline="Community"
        description={`${productName} is an open source project with a growing community. There are active, dedicated users willing to help you through various mediums.`}
        use_h1={true}
      />
      <VerticalTextBlockList
        product="terraform"
        data={[
          {
            header: 'Community Forum',
            body: `The <a href="https://discuss.hashicorp.com/c/terraform-core/27">Terraform section</a> of the community portal contains questions, use cases, and useful patterns.`,
          },
          {
            header: 'Bug Tracker',
            body: `<a href="https://github.com/hashicorp/${productSlug}/issues">Issue tracker on GitHub</a>. Please only use this for reporting bugs. Do not ask for general help here. Please use the <a href="https://discuss.hashicorp.com/c/terraform-core/27">Community Forum</a> for that.`,
          },
          {
            header: 'Training',
            body: 'Paid <a href="https://www.hashicorp.com/training">HashiCorp training courses</a> are also available in a city near you. Private training courses are also available.',
          },
          {
            header: 'Certification',
            body: 'Learn more about our <a href="https://www.hashicorp.com/certification">Cloud Engineer Certification program</a> and <a href="https://www.hashicorp.com/certification/terraform-associate">HashiCorp&apos;s Infrastructure Automation Certification</a> exams.',
          },
        ]}
      />
    </div>
  )
}
