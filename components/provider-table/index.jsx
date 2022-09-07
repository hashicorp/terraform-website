import s from './style.module.css'

export default function ProviderTable() {
  return (
    <table className={s.providerTable}>
      <tbody>
        <tr>
          <td>
            <strong>Tier</strong>
          </td>
          <td>
            <strong>Description</strong>
          </td>
          <td>
            <strong>Namespace</strong>
          </td>
        </tr>
        <tr>
          <td>
            <img src="/img/docs/official-tier.png" alt="" />
          </td>
          <td>
              <span>
                Official providers are owned and maintained by HashiCorp.{' '}
              </span>
          </td>
          <td>
            <code>
              <span>hashicorp</span>
            </code>
          </td>
        </tr>
        <tr>
          <td>
            <img src="/img/docs/partner-tier.png" alt="" />
          </td>
          <td>
              <span>
                Partner providers are written, maintained, validated and 
                published by third-party companies against their own APIs. 
                To earn a partner provider badge the partner must participate in the{' '}
              </span>
            <a href="https://www.hashicorp.com/ecosystem/become-a-partner/">
                <span>HashiCorp Technology Partner Program</span>
            </a>
              <span>.</span>
          </td>
          <td>
            <span>Third-party organization, e.g. </span>
            <code>
              <span>mongodb/mongodbatlas</span>
            </code>
          </td>
        </tr>
        <tr>
          <td>
            <img src="/img/docs/community-tier.png" alt="" />
          </td>
          <td>
            Community providers are published to the Terraform Registry by
            individual maintainers, groups of maintainers, or other members of
            the Terraform community.
          </td>
          <td>
            Maintainer&rsquo;s individual or organization account, e.g.{' '}
            <code>DeviaVir/gsuite</code>
          </td>
        </tr>
        <tr>
          <td>
            <img src="/img/docs/archived-tier.png" alt="" />
          </td>
          <td>
            Archived providers are official or partner providers that are no
            longer maintained by HashiCorp or the community. This may occur if
            an API is deprecated or interest was low.
          </td>
          <td>
            <code>hashicorp</code> or third-party
          </td>
        </tr>
      </tbody>
    </table>
  )
}
