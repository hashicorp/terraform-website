import Head from 'next/head'
import { productName, productSlug } from 'data/metadata'
import s from './style.module.css'

export default function SecurityPage() {
  return (
    <>
      <Head>
        <title key="title">Security | {productName} by HashiCorp</title>
        <meta
          name="description"
          content={`${productName} takes security very seriously. Please responsibly disclose any security vulnerabilities found and we'll handle it quickly.`}
        />
      </Head>
      <div className={s.security}>
        <h1>{productName} Security</h1>

        <p>
          We understand that many users place a high level of trust in HashiCorp
          and the tools we build. We apply best practices and focus on security
          to make sure we can maintain the trust of the community.
        </p>

        <p>
          We deeply appreciate any effort to disclose vulnerabilities
          responsibly.
        </p>

        <p>
          If you would like to report a vulnerability, please see the{' '}
          <a href="https://www.hashicorp.com/security">
            HashiCorp security page
          </a>
          , which has the proper email to communicate with as well as our PGP
          key. Please{' '}
          <strong>do not create an GitHub issue for security concerns</strong>.
        </p>

        <p>
          If you need to report a non-security related bug, please open an issue
          on the{' '}
          <a href={`https://github.com/hashicorp/${productSlug}`}>
            {productName} GitHub repository
          </a>
          .
        </p>
      </div>
    </>
  )
}
