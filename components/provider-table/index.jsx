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
            <i>
              <span>
                Official providers are owned and maintained by HashiCorp{' '}
              </span>
            </i>
          </td>
          <td>
            <code>
              <span>hashicorp</span>
            </code>
          </td>
        </tr>
        <tr>
          <td>
            <img src="/img/docs/verified-tier.png" alt="" />
          </td>
          <td>
            <i>
              <span>
                Verified providers are owned and maintained by third-party
                technology partners. Providers in this tier indicate HashiCorp
                has verified the authenticity of the Provider&rsquo;s publisher,
                and that the partner is a member of the{' '}
              </span>
            </i>
            <a href="https://www.hashicorp.com/ecosystem/become-a-partner/">
              <i>
                <span>HashiCorp Technology Partner Program</span>
              </i>
            </a>
            <i>
              <span>.</span>
            </i>
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
            Archived Providers are Official or Verified Providers that are no
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
