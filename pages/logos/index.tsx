import Head from 'next/head'
import { productName } from 'data/metadata'
import s from './style.module.css'

export default function LogosPage() {
  return (
    <>
      <Head>
        <title key="title">
          {productName} Logos | {productName} by HashiCorp
        </title>
      </Head>
      <div className={s.logos}>
        <h1>Terraform Logos</h1>

        <p>
          The following logos can be used in the <code>README</code> files for
          the core Terraform repository and the official providers, and for
          HashiCorp marketing purposes.
        </p>

        <p>
          Please refer to{' '}
          <a href="https://www.hashicorp.com/brand#terraform">
            the Terraform brand guidelines
          </a>{' '}
          for detailed guidelines on usage of these (and other) logo images.
        </p>

        <h2>Main Logo</h2>

        <p>This is the main logo to use.</p>

        <p>
          <a href="/img/logo-hashicorp.svg">
            <img
              src="/img/logo-hashicorp.svg"
              alt="Terraform and HashiCorp Wordmark"
            />
          </a>
        </p>

        <h2>Simpler Logo, without "HashiCorp"</h2>

        <p>
          This logo can be used in contexts where a simpler logo is required or
          where the "HashiCorp" reference is clear from context.
        </p>

        <p>
          <a href="/img/logo-text.svg">
            <img src="/img/logo-text.svg" alt="Terraform Wordmark" />
          </a>
        </p>

        <h2>Square Logo</h2>

        <p>
          The following logo is for situations where square images are required,
          such as in social media posts.
        </p>

        <p>
          <a href="/img/logo.png">
            <img src="/img/logo.png" alt="Terraform Logo" />
          </a>
        </p>
      </div>
    </>
  )
}
