import Head from 'next/head'
import s from './style.module.css'

export default function TerraformCloudTerms() {
  return (
    <>
      <Head>
        <title key="title">Terraform Cloud User Agreement</title>
      </Head>
      <div className={`g-grid-container ${s.root}`}>
        <h1>Terraform Cloud User Agreement HashiCorp, Inc.</h1>
        <p>
          This Terraform Cloud User Agreement, including all documents and terms
          incorporated by reference herein (collectively, the “Agreement”), is
          entered into by and between HashiCorp, Inc., a Delaware company with
          its principal place of business at 101 Second Street, Suite 700, San
          Francisco, CA 94105, USA (“HashiCorp”) and the organization you
          identified on HashiCorp’s Web site when you registered to use the SaaS
          Service (“Customer”). This Agreement is effective on the date you
          registered to use the SaaS Service (the “Effective Date”).
        </p>
        <p>
          BY REGISTERING TO USE THE SAAS SERVICE, YOU AGREE TO THE TERMS AND
          CONDITIONS OF THIS AGREEMENT ON BEHALF OF YOUR ORGANIZATION. YOU
          REPRESENT AND WARRANT THAT YOU HAVE THE LEGAL AUTHORITY TO BIND YOUR
          ORGANIZATION TO THIS AGREEMENT, AND THAT YOU HAVE READ AND UNDERSTOOD
          THIS AGREEMENT. IF YOU DO NOT HAVE SUCH AUTHORITY, OR IF YOU OR YOUR
          ORGANIZATION DOES NOT AGREE WITH THE TERMS OF THIS AGREEMENT, YOU
          SHOULD NOT ACCEPT IT.
        </p>
        <ol>
          <li>
            <strong>DEFINITIONS. </strong>
            <ol>
              <li>
                <strong>“Affiliate”</strong> means with respect to a Party, any
                person or entity that controls, is controlled by, or is under
                common control with such Party, where “control” means ownership
                of fifty percent (50%) or more of the outstanding voting
                securities.
              </li>
              <li>
                <strong>“Authorized User”</strong> means a named individual
                that: (a) is an employee, representative, consultant, contractor
                or agent of Customer or a Customer Affiliate; (b) is authorized
                to use the SaaS Service pursuant to this Agreement; and (c) has
                been supplied a user identification and password by Customer.
              </li>
              <li>
                <strong>“Customer Data”</strong> means any electronic data or
                materials provided or submitted by Customer or Authorized Users
                to or through the SaaS Service.
              </li>
              <li>
                <strong>“Documentation”</strong> means the online help
                materials, including technical specifications, describing the
                features and functionality of the SaaS Service, which are
                located on HashiCorp’s publicly-available website at{' '}
                <a
                  href="https://www.terraform.io/docs/enterprisel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.terraform.io/docs/enterprise
                </a>
                , as updated by HashiCorp from time to time.
              </li>
              <li>
                <strong>“Intellectual Property Rights”</strong> means all
                current and future worldwide intellectual property rights,
                including without limitation, all patents, copyrights,
                trademarks, service marks, trade names, domain name rights,
                know-how and other trade secret rights, and all other
                intellectual property rights and similar forms of protection,
                and all applications and registrations for any of the foregoing.
              </li>
              <li>
                <strong>“SaaS Service”</strong> means the applicable version of
                HashiCorp’s Terraform Cloud hosted software application.
              </li>
              <li>
                <strong>“Subscription Term(s)”</strong> means, unless a
                different period is specified on the HashiCorp web page where
                Customer registers for and downloads the SaaS Service, a
                subscription period(s) of one (1) year during which Authorized
                Users may use the SaaS Service, subject to the terms of this
                Agreement.
              </li>
              <li>
                <strong>“Support Services”</strong> means the maintenance and
                support services provided by HashiCorp to Customer during the
                Subscription Term, as more fully described in Section 2.3 below.
              </li>
            </ol>
          </li>

          <li>
            <strong>LICENSE AND SUPPORT SERVICES. </strong>

            <ol>
              <li>
                <strong>License and Access Rights to the SaaS Service.</strong>{' '}
                HashiCorp will host the SaaS Service and will make the SaaS
                Service available to Customer during the Subscription Term(s),
                subject to the terms and conditions of this Agreement. The SaaS
                Service is offered to Customer at no cost, unless customer has
                selected a paid version of the Software.{' '}
                <em>
                  Customer’s access and usage of the SaaS Service may not exceed
                  the typical and customary utilization of such service, as
                  contemplated by HashiCorp in its sole discretion (including,
                  but not limited to, creating/deleting an excessive number of
                  workspaces, excessive creation/deletion of accounts, and any
                  non-standard usage of compute resources), and may not
                  interfere with other users’ utilization of the SaaS Service.
                </em>{' '}
                HashiCorp may update the content, features, functionality, and
                user interface of the SaaS Service from time to time in its sole
                discretion, and may discontinue or suspend all or any portion of
                the SaaS Service at any time in its sole discretion, including
                during a Subscription Term; provided, that HashiCorp will give
                Customer at least fifteen (15) days’ advance notice before
                discontinuing the SaaS Service or materially decreasing the
                functionality of the SaaS Service during the Subscription Term.
                HashiCorp grants Customer a limited, non-exclusive,
                non-sublicenseable, nontransferable (except as specifically
                permitted in this Agreement) right to access and use the SaaS
                Service and its Documentation during the Subscription Term,
                solely for Customer’s internal business purposes. Customer may
                permit its Affiliates to use and access the SaaS Service and
                Documentation in accordance with this Agreement, but Customer
                will be responsible for the compliance of all Affiliates with
                this Agreement. For the avoidance of doubt, the SaaS Service is
                available only on a hosted basis, and Customer will not
                independently possess, run, or install the SaaS Service.
              </li>
              <li>
                <strong>Restrictions.</strong> Except as otherwise expressly set
                forth in this Agreement, Customer will not and will not permit
                any third party to: (a) sublicense, sell, transfer, assign,
                distribute or otherwise grant or enable access to the SaaS
                Service in a manner that allows anyone to access or use the SaaS
                Service without an Authorized User subscription, or to
                commercially exploit the SaaS Service; (b) copy, modify or
                create derivative works based on the SaaS Service; (c) reverse
                engineer or decompile the SaaS Service (except to the extent
                permitted by applicable law and only if HashiCorp fails to
                provide permitted interface information within a reasonable
                period of time after Customer’s written request); (d) copy any
                features, functions or graphics of the SaaS Service; (e) allow
                Authorized User subscriptions to be shared or used by more than
                one individual Authorized User (except that Authorized User
                subscriptions may be reassigned to new Authorized Users
                replacing individuals who no longer use the SaaS Service for any
                purpose, whether by termination of employment or other change in
                job status or function); or (f) access to or use of the SaaS
                Service: (i) to send, store, or serve as the infrastructure to
                facilitate infringing, obscene, threatening, or otherwise
                unlawful, unethical and/or potentially harmful material,
                including without limitation incitements to violence, defamatory
                material, public disinformation campaigns, and/or material
                violative of third-party privacy rights; (ii) in violation of
                applicable laws; (iii) to send or store material containing
                software viruses, worms, Trojan horses or other harmful computer
                code, files, scripts, or agents; (iv) in a manner that
                interferes with or disrupts the integrity or performance of the
                SaaS Service (or the data contained therein); (v) to gain
                unauthorized access to the SaaS Service (including unauthorized
                features and functionality) or its related systems or networks;
                (vi) Circumvent defined limits on an account in an unauthorized
                manner; (vii) Abuse referrals, promotions or credits to get more
                features than paid for; or (viii) Access, search, or create
                accounts for the SaaS Service by any means other than
                HashiCorp’s publicly supported interfaces (for example,
                “scraping” or creating accounts in bulk).
              </li>
              <li>
                <strong>Support Services.</strong> During the Subscription Term,
                HashiCorp will provide limited email support for the SaaS
                Service, which Customer may request by emailing HashiCorp at{' '}
                <a href="mailto:tf-cloud@hashicorp.support">
                  tf-cloud@hashicorp.support
                </a>
                . Customer acknowledges that Support Services do not include
                support for any open source versions of Terraform, and Customer
                agrees to request support only for the SaaS Service licensed
                under this Agreement.
              </li>
              <li>
                <strong>Usage Limits.</strong> Use of the SaaS Service is
                subject to any usage limits, which may include limitations on
                features and functionality, that are set forth on the HashiCorp
                web page where Customer registered for the SaaS Service. If
                Customer exceeds any such limits, Customer will promptly notify
                HashiCorp and work with HashiCorp to promptly change its usage
                to comply with the limits. HashiCorp may periodically verify
                that Customer’s use of the SaaS Service is within the applicable
                usage limits, and Customer will promptly and accurately certify
                and/or provide evidence of Customer’s compliance with the
                applicable usage limits as may be requested by HashiCorp from
                time to time.
              </li>
            </ol>
          </li>

          <li>
            <strong>
              Customer Responsibilities for Customer Data and Authorized Users.{' '}
            </strong>{' '}
            Customer agrees to promptly notify HashiCorp of any unauthorized
            access to Authorized User accounts of which Customer becomes aware.
            Customer has exclusive control and responsibility for determining
            what data Customer submits to the SaaS Service, for obtaining all
            necessary consents and permissions for submission of Customer Data
            and processing instructions to HashiCorp, and for the accuracy,
            quality and legality of Customer Data. Customer is further
            responsible for the acts and omissions of Authorized Users in
            connection with this Agreement, for all use of the SaaS Service by
            Authorized Users, and for any breach of this Agreement by Authorized
            Users. Customer will use reasonable measures to prevent and will
            promptly notify HashiCorp of any known or suspected unauthorized use
            of Authorized User access credentials.
          </li>

          <li>
            <strong>INTELLECTUAL PROPERTY RIGHTS AND OWNERSHIP. </strong>
            <ol>
              <li>
                <strong>Ownership.</strong> The SaaS Service and Documentation,
                all copies and portions thereof, and all Intellectual Property
                Rights therein, including, but not limited to derivative works
                therefrom, are and will remain the sole and exclusive property
                of HashiCorp notwithstanding any other provision in this
                Agreement. Customer is not authorized to use (and will not
                permit any third party to use) the SaaS Service, Documentation
                or any portion thereof except as expressly authorized by this
                Agreement.
              </li>
              <li>
                <strong>License to Customer Data.</strong> Customer grants
                HashiCorp a worldwide, non-exclusive license to host, copy,
                process, transmit and display Customer Data as reasonably
                necessary for HashiCorp to provide the SaaS Service in
                accordance with this Agreement. Subject to this limited license,
                as between Customer and HashiCorp, Customer owns all right,
                title and interest, including all related Intellectual Property
                Rights, in and to the Customer Data.
              </li>
              <li>
                <strong>Use of Aggregate Information.</strong> HashiCorp may
                collect and aggregate data derived from the operation of the
                SaaS Service (“Aggregated Data”), and HashiCorp may use such
                Aggregated Data for purposes of operating HashiCorp&apos;s
                business, monitoring performance of the SaaS Service, and/or
                improving the SaaS Service; provided, that HashiCorp&apos;s use
                of Aggregated Data does not reveal any Customer Data, Customer
                Confidential Information, or personally identifiable information
                of Authorized Users.
              </li>
            </ol>
          </li>

          <li>
            <strong>TERM; TERMINATION. </strong>

            <ol>
              <li>
                <strong>Effective Date and Term.</strong> This Agreement
                commences on the Effective Date. Unless earlier terminated
                pursuant to the terms of this Section 5, the Agreement will
                continue through the Subscription Term. Unless one party
                notifies the other more than fifteen (15) days before the end of
                a Subscription Term, each Subscription Term will automatically
                renew for an additional Subscription Term of the same length.
              </li>
              <li>
                <strong>Termination for Cause.</strong> Either Party may
                terminate this Agreement immediately upon written notice to the
                other Party: (a) if the other Party breaches or fails to perform
                or observe any material term or condition of this Agreement and
                such default has not been cured within fifteen (15) days after
                written notice of such default to the other Party; or (b) if the
                other Party (i) terminates or suspends its business, (ii)
                becomes subject to any insolvency proceeding under federal or
                state statute, (iii) becomes insolvent or subject to direct
                control by a trustee, receiver or similar authority, or (iv) has
                wound up or liquidated, voluntarily or otherwise. For the
                avoidance of doubt, termination of this Agreement will result in
                the termination of all Subscription Terms.
              </li>
              <li>
                <strong>Termination for Convenience; Suspension.</strong> Either
                Party may terminate this Agreement for any reason or no reason
                by providing the other party at least fifteen (15) days prior
                written notice. In addition, HashiCorp may discontinue or
                suspend Customer’s access to the SaaS Service immediately if
                Customer has (or HashiCorp reasonably suspects that Customer
                has) breached Section 2.2 or infringed HashiCorp’s Intellectual
                Property Rights.
              </li>
              <li>
                <strong>Effect of Termination.</strong> Upon expiration or
                termination of this Agreement for any reason: (a) HashiCorp’s
                obligation to provide Support Services and the SaaS Service will
                terminate, (b) all of Customer’s and its Authorized Users’
                rights to use the SaaS Service will terminate, and (c) the
                provisions of Sections 4.3, 6.4, 7, 8, 9, and 10 of this
                Agreement will survive such expiration or termination.
              </li>
              <li>
                <strong>
                  Treatment of Customer Data Following Expiration or
                  Termination.
                </strong>{' '}
                Customer agrees that following termination of this Agreement,
                HashiCorp may immediately deactivate Customer’s account(s) for
                the SaaS Service, and HashiCorp has the right to delete those
                accounts, including all Customer Data, from HashiCorp’s site
                unless legally prohibited. Customer acknowledges and agrees that
                is responsible to retrieve Customer Data from the SaaS Service
                prior to expiration of this Agreement.
              </li>
            </ol>
          </li>

          <li>
            <strong>REPRESENTATIONS AND WARRANTIES. </strong>

            <ol>
              <li>
                <strong>By Each Party.</strong> Each Party represents and
                warrants that it has the power and authority to enter into this
                Agreement and that its respective provision and use of the SaaS
                Service is in compliance with laws applicable to such Party.
              </li>
              <li>
                <strong>Conformity with Documentation.</strong> HashiCorp
                warrants that, during the Subscription Term, the SaaS Service
                will perform materially in accordance with the applicable
                Documentation. In the event of a material breach of the
                foregoing warranty, Customer’s exclusive remedy and HashiCorp’s
                entire liability will be for Customer to request HashiCorp’s
                assistance through the Support Services, which HashiCorp will
                provide in accordance with its obligations under Section 2.3
                (“Support Services”).
              </li>
              <li>
                <strong>Malicious Code.</strong> HashiCorp warrants that, to the
                best of its knowledge, the SaaS Service is free from, and
                HashiCorp will not knowingly introduce, software viruses, worms,
                Trojan horses or other code, files, scripts, or agents intended
                to do harm.
              </li>
              <li>
                <strong>WARRANTY DISCLAIMERS.</strong> EXCEPT FOR THE EXCLUSIVE
                WARRANTIES SET FORTH IN THIS SECTION 6, TO THE MAXIMUM EXTENT
                PERMITTED UNDER APPLICABLE LAW, THE SAAS SERVICE IS PROVIDED “AS
                IS” WITHOUT WARRANTY OF ANY KIND, AND HASHICORP MAKES NO
                WARRANTIES, EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, WITH
                REGARDING OR RELATING TO THE SAAS SERVICE, DOCUMENTATION OR
                SUPPORT SERVICES. HASHICORP SPECIFICALLY AND EXPLICITLY
                DISCLAIMS ALL OTHER WARRANTIES, EXPRESS AND IMPLIED, INCLUDING
                WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, THOSE
                ARISING FROM A COURSE OF DEALING OR USAGE OR TRADE, AND ALL SUCH
                WARRANTIES ARE HEREBY EXCLUDED TO THE FULLEST EXTENT PERMITTED
                BY LAW. FURTHER, HASHICORP DOES NOT WARRANT THE SAAS SERVICE
                WILL BE ERROR-FREE OR THAT THE USE OF THE SAAS SERVICE WILL BE
                UNINTERRUPTED.
              </li>
            </ol>
          </li>

          <li>
            <strong>INDEMNIFICATION.</strong>

            <ol>
              <li>
                <strong>By HashiCorp.</strong> Subject to the remainder of this
                Section 7 and the liability limitations set forth in Section 8,
                HashiCorp will: (a) defend Customer against any third party
                claim that the SaaS Service infringes any trademark or copyright
                of such third party, enforceable in the jurisdiction of
                Customer’s use of the SaaS Service, or misappropriates a trade
                secret (but only to the extent that such misappropriation is not
                a result of Customer’s actions) (“Infringement Claim”); and (b)
                indemnify Customer against and pay any settlement of such
                Infringement Claim consented to by HashiCorp or any damages
                finally awarded against Customer to such third party by a court
                of competent jurisdiction. HashiCorp will have no obligation and
                assumes no liability under this Section 7 or otherwise with
                respect to any claim to the extent based on: (a) any
                modification of the SaaS Service that is not performed by or on
                behalf of HashiCorp, or was performed in compliance with
                Customer’s specifications; (b) the combination, operation or use
                of the SaaS Service with any Customer Data or any Customer or
                third party products, services, hardware, data, content, or
                business processes not provided by HashiCorp where there would
                be no Infringement Claim but for such combination; (c) use of
                the SaaS Service other than in accordance with the terms and
                conditions of this Agreement and the Documentation; or (d)
                Customer’s or any Authorized User’s use of the SaaS Service
                other than as permitted under this Agreement SaaS Service. THIS
                SECTION 7 STATES CUSTOMER’S SOLE AND EXCLUSIVE REMEDY AND
                HASHICORP’S ENTIRE LIABILITY FOR ANY INFRINGEMENT CLAIMS OR
                ACTIONS.
              </li>
              <li>
                <strong>Remedies.</strong> Should the SaaS Service become, or in
                HashiCorp’s opinion be likely to become, the subject of an
                Infringement Claim, HashiCorp may, at its option (i) procure for
                Customer the right to use the SaaS Service in accordance with
                this Agreement; (ii) replace or modify, the SaaS Service to make
                it non-infringing; or (iii) terminate Customer’s right to use
                the SaaS Service and discontinue the related Support Services.
              </li>
              <li>
                <strong>By Customer.</strong> Customer will defend, indemnify
                and hold harmless HashiCorp and its Affiliates, and its and
                their directors, officers, employees, agents and licensors, from
                and against any damages and costs (including reasonable
                attorneys’ fees and costs incurred by the indemnified parties)
                finally awarded against them in connection with any claim
                arising from (i) Customer’s use of the SaaS Service or (ii)
                Customer Data ; provided, that Customer will have no obligation
                under this Section 7.3 to the extent the applicable claim arises
                from HashiCorp’s breach of this Agreement.
              </li>
              <li>
                <strong>Indemnity Process.</strong> Each Party’s indemnification
                obligations are conditioned on the indemnified party: (a)
                promptly giving written notice of the claim to the indemnifying
                Party; (b) giving the indemnifying Party sole control of the
                defense and settlement of the claim; and (c) providing to the
                indemnifying Party all available information and assistance in
                connection with the claim, at the indemnifying Party’s request
                and expense. The indemnified Party may participate in the
                defense of the claim, at the indemnified Party’s sole expense
                (not subject to reimbursement). Neither Party may admit
                liability for or consent to any judgment or concede or settle or
                compromise any claim unless such admission or concession or
                settlement or compromise includes a full and unconditional
                release of the other Party from all liabilities in respect of
                such claim.
              </li>
            </ol>
          </li>

          <li>
            <strong>LIMITATION OF LIABILITY. </strong>

            <ol>
              <li>
                <strong>Damages Exclusion; Liability Cap.</strong> IN NO EVENT
                WILL EITHER PARTY OR ITS AFFILIATES OR LICENSORS BE LIABLE UNDER
                THIS AGREEMENT FOR ANY CONSEQUENTIAL, INCIDENTAL, SPECIAL,
                INDIRECT, PUNITIVE OR EXEMPLARY DAMAGES, INCLUDING WITHOUT
                LIMITATION LOST PROFITS, LOSS OF USE, BUSINESS INTERRUPTIONS,
                LOSS OF DATA, REVENUE, GOODWILL, PRODUCTION, ANTICIPATED
                SAVINGS, OR COSTS OF PROCUREMENT OF SUBSTITUTE GOODS OR
                SERVICES, WHETHER ALLEGED AS A BREACH OF CONTRACT OR TORTIOUS
                CONDUCT, INCLUDING NEGLIGENCE, EVEN IF A PARTY HAS BEEN ADVISED
                OF THE POSSIBILITY OF SUCH DAMAGES. EXCEPT WITH RESPECT TO
                LIABILITY ARISING FROM ITS OBLIGATIONS UNDER SECTION 7
                (“INDEMNIFICATION”) (FOR WHICH THE LIABILITY LIMITATION IS ONE
                HUNDRED THOUSAND DOLLARS ($100,000) IN THE AGGREGATE), IN NO
                EVENT WILL HASHICORP’S TOTAL AGGREGATE LIABILITY ARISING UNDER
                THIS AGREEMENT EXCEED TEN THOUSAND DOLLARS ($10,000). NOTHING IN
                THIS SECTION 8.1 WILL BE DEEMED TO LIMIT EITHER PARTY’S
                LIABILITY FOR WILLFUL MISCONDUCT, GROSS NEGLIGENCE, FRAUD, OR
                INFRINGEMENT BY ONE PARTY OF THE OTHER’S INTELLECTUAL PROPERTY
                RIGHTS.
              </li>
              <li>
                <strong>Limitations Fair and Reasonable.</strong> EACH PARTY
                ACKNOWLEDGES THAT THE LIMITATIONS OF LIABILITY SET FORTH IN THIS
                SECTION 8 REFLECT THE ALLOCATION OF RISK BETWEEN THE PARTIES
                UNDER THIS AGREEMENT, AND THAT IN THE ABSENCE OF SUCH
                LIMITATIONS OF LIABILITY, THE ECONOMIC TERMS OF THIS AGREEMENT
                WOULD BE SIGNIFICANTLY DIFFERENT.
              </li>
            </ol>
          </li>

          <li>
            <strong>CONFIDENTIAL INFORMATION.</strong>
            <ol>
              <li>
                <strong>Confidentiality.</strong> “Confidential Information”
                means this Agreement, the SaaS Service, HashiCorp pricing
                information, HashiCorp technical information, Customer Data and
                any other information disclosed by one party (“Discloser”) to
                the other (“Recipient”) in connection with this Agreement that
                is designated as confidential or that reasonably should be
                understood to be confidential given the nature of the
                information and the circumstances of disclosure. Recipient may
                use Discloser’s Confidential Information solely to perform
                Recipient’s obligations or exercise its rights hereunder.
                Recipient will not disclose, or permit to be disclosed,
                Discloser’s Confidential Information to any third party without
                Discloser’s prior written consent, except that Recipient may
                disclose Discloser’s Confidential Information solely to
                Recipient’s employees and/or subcontractors who have a need to
                know and who are bound in writing to keep such information
                confidential pursuant to confidentiality agreements consistent
                with this Agreement. Recipient agrees to exercise due care in
                protecting Discloser’s Confidential Information from
                unauthorized use and disclosure, and in any case will not use
                less than the degree of care a reasonable person would use. The
                foregoing will not apply to any information that: (a) was in the
                public domain at the time it was communicated to the Recipient
                by the Discloser; (b) entered the public domain subsequent to
                the time it was communicated to the Recipient by the Discloser
                through no fault of the Recipient; (c) was in the Recipient’s
                possession free of any obligation of confidence at the time it
                was communicated to the Recipient by the Discloser; (d) was
                rightfully communicated to the Recipient free of any obligation
                of confidence subsequent to the time it was communicated to the
                Recipient by the Discloser; (e) it was developed by employees or
                agents of the Recipient independently of and without reference
                to any information communicated to the Recipient by the
                Discloser; or (f) is expressly permitted to be disclosed
                pursuant to the terms of this Agreement.
              </li>
              <li>
                <strong>Compelled Disclosure.</strong> The Recipient will not be
                in violation of Section 9.1 regarding a disclosure that was in
                response to a valid order by a court or other governmental body,
                provided that the Recipient provides the Discloser with prior
                written notice of such disclosure in order to permit the
                Discloser to seek confidential treatment of such information.
              </li>
              <li>
                <strong>Feedback.</strong> To the extent Customer provides any
                suggestions, recommendations or other feedback specifically
                relating to the SaaS Service or Support Services (collectively,
                “Feedback”), Customer grants to HashiCorp a royalty free, fully
                paid, sub-licensable, transferable (notwithstanding Section 10.1
                (“Assignment”), non-exclusive, irrevocable, perpetual, worldwide
                right and license to make, use, sell, offer for sale, import and
                otherwise exploit Feedback (including by incorporation of such
                Feedback into the SaaS Service without restrictions).
              </li>
              <li>
                <strong>Sensitive Data.</strong> Customer agrees that it will
                not submit the following types of information to the SaaS
                Service except with HashiCorp’s prior written approval:
                government-issued identification numbers, consumer financial
                account information, credit and payment card information,
                personal health information, or information deemed “sensitive”
                under applicable law (such as racial or ethnic origin, political
                opinions, or religious or philosophical beliefs) or personal
                data (as described in the Regulation (EU) 2016/679 of the
                European Parliament and of the Council of 27 April 2016 on the
                protection of natural persons with regard to the processing of
                personal data and on the free movement of such data) of data
                subjects that reside in the European Economic Area (EEA). If
                Customer wishes to submit any such European personal data to the
                SaaS Service, Customer will notify HashiCorp and the parties may
                enter into a separate data processing agreement (including the
                European Commission’s Standard Contract Clauses for the transfer
                of personal data to processors established in third countries
                which do not ensure an adequate level of data protection) with
                HashiCorp prior to submission of such personal data to the SaaS
                Service. Customer represents and warrants that it has obtained
                all necessary consents and permissions from data subjects for
                the submission and processing of personal data in the SaaS
                Service.
              </li>
            </ol>
          </li>

          <li>
            <strong>GENERAL.</strong>

            <ol>
              <li>
                <strong>Assignment.</strong> Neither Party may assign this
                Agreement, in whole or in part, without the prior written
                consent of the other Party, provided that no such consent will
                be required to assign this Agreement in its entirety to (i) an
                Affiliate that is able to satisfy the obligations of the
                assignor under this Agreement or (ii) a successor in interest in
                connection with a merger, acquisition or sale of all or
                substantially of the assigning Party’s assets, provided that the
                assignee has agreed to be bound by all of the terms of this
                Agreement and all fees owed to the other Party are paid in full.
                If Customer is acquired by, sells substantially all of its
                assets to, or undergoes a change of control in a favor of, a
                direct competitor of HashiCorp, then HashiCorp may terminate
                this Agreement immediately upon written notice.
              </li>
              <li>
                <strong>Anti-Corruption.</strong> Each Party acknowledges that
                it is aware of, understands and has complied and will comply
                with, all applicable U.S. and foreign anti-corruption laws,
                including without limitation, the U.S. Foreign Corrupt Practices
                Act (“FCPA”) and the U.K. Bribery Act.
              </li>
              <li>
                <strong>Notices.</strong> Notices to a Party will be sent by
                first-class mail, overnight courier or prepaid post to the
                address for such Party as identified on the first page of this
                Agreement and will be deemed given seventy-two (72) hours after
                mailing or upon confirmed delivery or receipt, whichever is
                sooner. Customer will address notices to HashiCorp Legal
                Department, with a copy to{' '}
                <a href="mailto:legalnotices@hashicorp.com">
                  legalnotices@hashicorp.com
                </a>
                . Either Party may from time to time change its address for
                notices under this Section by giving the other Party at least
                thirty (30) days prior written notice of the change in
                accordance with this Section 10.3.
              </li>
              <li>
                <strong>Non-waiver.</strong> Any failure of either Party to
                insist upon or enforce performance by the other Party of any of
                the provisions of this Agreement or to exercise any rights or
                remedies under this Agreement will not be interpreted or
                construed as a waiver or relinquishment of such Party&apos;s
                right to assert or rely upon such provision, right or remedy in
                that or any other instance.
              </li>
              <li>
                <strong>Governing Law.</strong> This Agreement will be governed
                by the Applicable Law (without regard to the conflicts of law
                provisions of any jurisdiction), and claims arising out of or in
                connection with this Agreement will be subject to the exclusive
                jurisdiction of the Applicable Jurisdiction based on the
                Customer&apos;s residence, as provided in the following table:
                <table>
                  <thead>
                    <tr>
                      <th>Customer Residence</th>
                      <th>Applicable Law</th>
                      <th>Applicable Jurisdiction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>North America &amp; South America</td>
                      <td>State of California, United States</td>
                      <td>San Francisco, California, United States</td>
                    </tr>
                    <tr>
                      <td>Europe, Middle East, Africa</td>
                      <td>England</td>
                      <td>London, United Kingdom</td>
                    </tr>
                    <tr>
                      <td>Asia</td>
                      <td>Singapore</td>
                      <td>Singapore</td>
                    </tr>
                    <tr>
                      <td>Australia, New Zealand</td>
                      <td>New South Wales, Australia</td>
                      <td>Sydney, New South Wales, Australia</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  Each Party irrevocably submits to the personal jurisdiction
                  and venue of and agrees to service of process issued or
                  authorized by, any court in the Applicable Jurisdiction in any
                  action or proceeding. Neither the United Nations Convention of
                  Contracts for the International Sale of Goods nor the Uniform
                  Computer Information Transactions Act will apply to this
                  Agreement.
                </p>
              </li>
              <li>
                <strong>Severability.</strong> If any provision of this
                Agreement is held invalid or unenforceable under applicable law
                by a court of competent jurisdiction, it will be replaced with
                the valid provision that most closely reflects the intent of the
                Parties and the remaining provisions of the Agreement will
                remain in full force and effect.
              </li>
              <li>
                <strong>Relationship of the Parties.</strong> Nothing in this
                Agreement is to be construed as creating an agency, partnership,
                or joint venture relationship between the Parties hereto.
                Neither Party has any right or authority to assume or create any
                obligations or to make any representations or warranties on
                behalf of any other Party, whether express or implied, or to
                bind the other Party in any respect whatsoever. Each Party may
                identify the other as a customer or supplier, as applicable.
              </li>
              <li>
                <strong>U.S. Government Restricted Rights.</strong> If the SaaS
                Service is being licensed by the U.S. Government, the SaaS
                Service is “commercial computer software” and “commercial
                computer documentation” developed exclusively at private
                expense, and (a) if acquired by or on behalf of a civilian
                agency, will be subject solely to the terms of this computer
                software license as specified in 48 C.F.R. 12.212 of the Federal
                Acquisition Regulations and its successors; and (b) if acquired
                by or on behalf of units of the Department of Defense (“DOD”)
                will be subject to the terms of this commercial computer
                software license as specified in 48 C.F.R. 227.7202-2, DOD FAR
                Supplement and its successors.
              </li>
              <li>
                <strong>Export Laws.</strong> Each Party will comply with the
                export laws and regulations of the United States and other
                applicable jurisdictions in providing and using the SaaS
                Service. Without limiting the generality of the foregoing,
                Customer represents that it is not named on any U.S. government
                denied-party list and will not make the SaaS Service available
                to any user or entity that is located in a country that is
                subject to a U.S. government embargo, or is listed on any U.S.
                government list of prohibited or restricted parties.
              </li>
              <li>
                <strong>Entire Agreement; Execution.</strong> This Agreement
                comprises the entire agreement between Customer and HashiCorp,
                and supersedes all prior or contemporaneous proposals, quotes,
                negotiations, discussions, or agreements, whether written or
                oral, between the Parties regarding its subject matter. In the
                event of a conflict between the terms of this Agreement and any
                other document referenced in this Agreement, this Agreement will
                control. Any preprinted terms on any Customer ordering documents
                or terms referenced or linked therein will have no effect on the
                terms of this Agreement and are hereby rejected, including where
                such Customer ordering document is signed by HashiCorp. This
                Agreement may be executed in counterparts, which taken together
                form one binding legal instrument. The Parties hereby consent to
                the use of electronic signatures in connection with the
                execution of this Agreement, and further agree that electronic
                signatures to this Agreement will be legally binding with the
                same force and effect as manually executed signatures.
              </li>
            </ol>
          </li>
        </ol>
        <p>
          <em>Last updated: August 30, 2019</em>
        </p>
      </div>
    </>
  )
}
