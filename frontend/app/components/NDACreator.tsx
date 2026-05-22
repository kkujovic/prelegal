'use client'

import { useState, useRef } from 'react'

interface NDAData {
  purpose: string
  effectiveDate: string
  mndaTermType: 'fixed' | 'indefinite'
  mndaTermYears: string
  confidentialityTermType: 'fixed' | 'perpetual'
  confidentialityTermYears: string
  governingLaw: string
  jurisdiction: string
  party1Company: string
  party1Name: string
  party1Title: string
  party1Contact: string
  party2Company: string
  party2Name: string
  party2Title: string
  party2Contact: string
}

const today = new Date().toISOString().split('T')[0]

const DEFAULT_DATA: NDAData = {
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: today,
  mndaTermType: 'fixed',
  mndaTermYears: '1',
  confidentialityTermType: 'fixed',
  confidentialityTermYears: '1',
  governingLaw: '',
  jurisdiction: '',
  party1Company: '',
  party1Name: '',
  party1Title: '',
  party1Contact: '',
  party2Company: '',
  party2Name: '',
  party2Title: '',
  party2Contact: '',
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '[Effective Date]'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function placeholder(val: string, fallback: string): string {
  return val.trim() ? val.trim() : fallback
}

function CoverPagePreview({ d }: { d: NDAData }) {
  const mndaTerm =
    d.mndaTermType === 'fixed'
      ? `Expires ${placeholder(d.mndaTermYears, '1')} year(s) from Effective Date.`
      : 'Continues until terminated in accordance with the terms of the MNDA.'

  const confTerm =
    d.confidentialityTermType === 'fixed'
      ? `${placeholder(d.confidentialityTermYears, '1')} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : 'In perpetuity.'

  return (
    <div className="document-section">
      <h1 className="doc-title">Mutual Non-Disclosure Agreement</h1>

      <div className="usage-box">
        <p>
          This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover
          Page (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA
          Standard Terms Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to
          those posted at commonpaper.com/standards/mutual-nda/1.0. Any modifications of the
          Standard Terms should be made on the Cover Page, which will control over conflicts with
          the Standard Terms.
        </p>
      </div>

      <table className="cover-table">
        <tbody>
          <tr>
            <td className="field-label">
              <strong>Purpose</strong>
              <span className="field-hint">How Confidential Information may be used</span>
            </td>
            <td className="field-value">
              {placeholder(d.purpose, '[Purpose not specified]')}
            </td>
          </tr>
          <tr>
            <td className="field-label">
              <strong>Effective Date</strong>
            </td>
            <td className="field-value">{formatDate(d.effectiveDate)}</td>
          </tr>
          <tr>
            <td className="field-label">
              <strong>MNDA Term</strong>
              <span className="field-hint">The length of this MNDA</span>
            </td>
            <td className="field-value">{mndaTerm}</td>
          </tr>
          <tr>
            <td className="field-label">
              <strong>Term of Confidentiality</strong>
              <span className="field-hint">How long Confidential Information is protected</span>
            </td>
            <td className="field-value">{confTerm}</td>
          </tr>
          <tr>
            <td className="field-label">
              <strong>Governing Law &amp; Jurisdiction</strong>
            </td>
            <td className="field-value">
              <div>
                Governing Law:{' '}
                <strong>{placeholder(d.governingLaw, '[State]')}</strong>
              </div>
              <div>
                Jurisdiction:{' '}
                <strong>{placeholder(d.jurisdiction, '[City/County, State]')}</strong>
              </div>
            </td>
          </tr>
          <tr>
            <td className="field-label">
              <strong>MNDA Modifications</strong>
            </td>
            <td className="field-value">None.</td>
          </tr>
        </tbody>
      </table>

      <p className="signing-intro">
        By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective
        Date.
      </p>

      <table className="sig-table">
        <thead>
          <tr>
            <th></th>
            <th>PARTY 1</th>
            <th>PARTY 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Signature</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Print Name</td>
            <td>{placeholder(d.party1Name, '')}</td>
            <td>{placeholder(d.party2Name, '')}</td>
          </tr>
          <tr>
            <td>Title</td>
            <td>{placeholder(d.party1Title, '')}</td>
            <td>{placeholder(d.party2Title, '')}</td>
          </tr>
          <tr>
            <td>Company</td>
            <td>{placeholder(d.party1Company, '')}</td>
            <td>{placeholder(d.party2Company, '')}</td>
          </tr>
          <tr>
            <td>Notice Address</td>
            <td>{placeholder(d.party1Contact, '')}</td>
            <td>{placeholder(d.party2Contact, '')}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <p className="cc-notice">
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
      </p>
    </div>
  )
}

function StandardTermsPreview({ d }: { d: NDAData }) {
  const purposeVal = placeholder(d.purpose, '[Purpose]')
  const effectiveDateVal = formatDate(d.effectiveDate)
  const mndaTermVal =
    d.mndaTermType === 'fixed'
      ? `${placeholder(d.mndaTermYears, '1')} year(s) from Effective Date`
      : 'the date of termination'
  const confTermVal =
    d.confidentialityTermType === 'fixed'
      ? `${placeholder(d.confidentialityTermYears, '1')} year(s) from Effective Date`
      : 'perpetuity'
  const govLawVal = placeholder(d.governingLaw, '[Governing Law]')
  const jurisdictionVal = placeholder(d.jurisdiction, '[Jurisdiction]')

  const ref = (text: string) => <strong className="coverpage-ref">{text}</strong>

  return (
    <div className="document-section standard-terms">
      <h2 className="terms-title">Standard Terms</h2>

      <ol className="terms-list">
        <li>
          <strong>Introduction.</strong> This Mutual Non-Disclosure Agreement (which incorporates
          these Standard Terms and the Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>
          &rdquo;) allows each party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose
          or make available information in connection with the {ref(purposeVal)} which (1) the
          Disclosing Party identifies to the receiving party (&ldquo;<strong>Receiving Party</strong>
          &rdquo;) as &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like or (2)
          should be reasonably understood as confidential or proprietary due to its nature and the
          circumstances of its disclosure (&ldquo;<strong>Confidential Information</strong>&rdquo;).
          Each party&rsquo;s Confidential Information also includes the existence and status of the
          parties&rsquo; discussions and information on the Cover Page. Confidential Information
          includes technical or business information, product designs or roadmaps, requirements,
          pricing, security and compliance documentation, technology, inventions and know-how. To
          use this MNDA, the parties must complete and sign a cover page incorporating these
          Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on
          the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.
        </li>

        <li>
          <strong>Use and Protection of Confidential Information.</strong> The Receiving Party
          shall: (a) use Confidential Information solely for the {ref(purposeVal)}; (b) not
          disclose Confidential Information to third parties without the Disclosing Party&rsquo;s
          prior written approval, except that the Receiving Party may disclose Confidential
          Information to its employees, agents, advisors, contractors and other representatives
          having a reasonable need to know for the {ref(purposeVal)}, provided these representatives
          are bound by confidentiality obligations no less protective of the Disclosing Party than
          the applicable terms in this MNDA and the Receiving Party remains responsible for their
          compliance with this MNDA; and (c) protect Confidential Information using at least the
          same protections the Receiving Party uses for its own similar information but no less than
          a reasonable standard of care.
        </li>

        <li>
          <strong>Exceptions.</strong> The Receiving Party&rsquo;s obligations in this MNDA do not
          apply to information that it can demonstrate: (a) is or becomes publicly available through
          no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from
          the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from
          a third party without confidentiality restrictions; or (d) it independently developed
          without using or referencing the Confidential Information.
        </li>

        <li>
          <strong>Disclosures Required by Law.</strong> The Receiving Party may disclose
          Confidential Information to the extent required by law, regulation or regulatory
          authority, subpoena or court order, provided (to the extent legally permitted) it provides
          the Disclosing Party reasonable advance notice of the required disclosure and reasonably
          cooperates, at the Disclosing Party&rsquo;s expense, with the Disclosing Party&rsquo;s
          efforts to obtain confidential treatment for the Confidential Information.
        </li>

        <li>
          <strong>Term and Termination.</strong> This MNDA commences on the{' '}
          {ref(effectiveDateVal)} and expires at the end of the {ref(mndaTermVal)}. Either party
          may terminate this MNDA for any or no reason upon written notice to the other party. The
          Receiving Party&rsquo;s obligations relating to Confidential Information will survive for
          the {ref(confTermVal)}, despite any expiration or termination of this MNDA.
        </li>

        <li>
          <strong>Return or Destruction of Confidential Information.</strong> Upon expiration or
          termination of this MNDA or upon the Disclosing Party&rsquo;s earlier request, the
          Receiving Party will: (a) cease using Confidential Information; (b) promptly after the
          Disclosing Party&rsquo;s written request, destroy all Confidential Information in the
          Receiving Party&rsquo;s possession or control or return it to the Disclosing Party; and
          (c) if requested by the Disclosing Party, confirm its compliance with these obligations in
          writing. As an exception to subsection (b), the Receiving Party may retain Confidential
          Information in accordance with its standard backup or record retention policies or as
          required by law, but the terms of this MNDA will continue to apply to the retained
          Confidential Information.
        </li>

        <li>
          <strong>Proprietary Rights.</strong> The Disclosing Party retains all of its intellectual
          property and other rights in its Confidential Information and its disclosure to the
          Receiving Party grants no license under such rights.
        </li>

        <li>
          <strong>Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;,
          WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE,
          MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
        </li>

        <li>
          <strong>Governing Law and Jurisdiction.</strong> This MNDA and all matters relating
          hereto are governed by, and construed in accordance with, the laws of the State of{' '}
          {ref(govLawVal)}, without regard to the conflict of laws provisions of such{' '}
          {ref(govLawVal)}. Any legal suit, action, or proceeding relating to this MNDA must be
          instituted in the federal or state courts located in {ref(jurisdictionVal)}. Each party
          irrevocably submits to the exclusive jurisdiction of such {ref(jurisdictionVal)} in any
          such suit, action, or proceeding.
        </li>

        <li>
          <strong>Equitable Relief.</strong> A breach of this MNDA may cause irreparable harm for
          which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the
          Disclosing Party is entitled to seek appropriate equitable relief, including an
          injunction, in addition to its other remedies.
        </li>

        <li>
          <strong>General.</strong> Neither party has an obligation under this MNDA to disclose
          Confidential Information to the other or proceed with any proposed transaction. Neither
          party may assign this MNDA without the prior written consent of the other party, except
          that either party may assign this MNDA in connection with a merger, reorganization,
          acquisition or other transfer of all or substantially all its assets or voting securities.
          Any assignment in violation of this Section is null and void. This MNDA will bind and
          inure to the benefit of each party&rsquo;s permitted successors and assigns. Waivers must
          be signed by the waiving party&rsquo;s authorized representative and cannot be implied
          from conduct. If any provision of this MNDA is held unenforceable, it will be limited to
          the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA
          (including the Cover Page) constitutes the entire agreement of the parties with respect to
          its subject matter, and supersedes all prior and contemporaneous understandings,
          agreements, representations, and warranties, whether written or oral, regarding such
          subject matter. This MNDA may only be amended, modified, waived, or supplemented by an
          agreement in writing signed by both parties. Notices, requests and approvals under this
          MNDA must be sent in writing to the email or postal addresses on the Cover Page and are
          deemed delivered on receipt. This MNDA may be executed in counterparts, including
          electronic copies, each of which is deemed an original and which together form the same
          agreement.
        </li>
      </ol>

      <p className="cc-notice">
        Common Paper Mutual Non-Disclosure Agreement{' '}
        <a href="https://commonpaper.com/standards/mutual-nda/1.0/" target="_blank" rel="noreferrer">
          Version 1.0
        </a>{' '}
        free to use under CC BY 4.0.
      </p>
    </div>
  )
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {hint && <span className="form-hint">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export default function NDACreator() {
  const [data, setData] = useState<NDAData>(DEFAULT_DATA)
  const previewRef = useRef<HTMLDivElement>(null)

  function update(field: keyof NDAData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="nda-creator">
      {/* Header */}
      <header className="app-header no-print">
        <div className="header-content">
          <div>
            <h1 className="app-title">Mutual NDA Creator</h1>
            <p className="app-subtitle">
              Fill in the key terms — the completed agreement updates in real time.
            </p>
          </div>
          <button onClick={handlePrint} className="download-btn">
            Download PDF
          </button>
        </div>
      </header>

      <div className="main-layout">
        {/* Form panel */}
        <aside className="form-panel no-print">
          <div className="form-section">
            <h2 className="section-heading">Agreement Terms</h2>

            <FormField label="Purpose" hint="How Confidential Information may be used">
              <textarea
                className="form-textarea"
                value={data.purpose}
                onChange={(e) => update('purpose', e.target.value)}
                rows={3}
              />
            </FormField>

            <FormField label="Effective Date">
              <input
                type="date"
                className="form-input"
                value={data.effectiveDate}
                onChange={(e) => update('effectiveDate', e.target.value)}
              />
            </FormField>

            <FormField label="MNDA Term" hint="Length of this agreement">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mndaTermType"
                    value="fixed"
                    checked={data.mndaTermType === 'fixed'}
                    onChange={() => update('mndaTermType', 'fixed')}
                  />
                  Expires after
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="inline-number"
                    value={data.mndaTermYears}
                    onChange={(e) => update('mndaTermYears', e.target.value)}
                    disabled={data.mndaTermType !== 'fixed'}
                  />
                  year(s) from Effective Date
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mndaTermType"
                    value="indefinite"
                    checked={data.mndaTermType === 'indefinite'}
                    onChange={() => update('mndaTermType', 'indefinite')}
                  />
                  Continues until terminated
                </label>
              </div>
            </FormField>

            <FormField label="Term of Confidentiality" hint="How long information stays protected">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="confidentialityTermType"
                    value="fixed"
                    checked={data.confidentialityTermType === 'fixed'}
                    onChange={() => update('confidentialityTermType', 'fixed')}
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="inline-number"
                    value={data.confidentialityTermYears}
                    onChange={(e) => update('confidentialityTermYears', e.target.value)}
                    disabled={data.confidentialityTermType !== 'fixed'}
                  />
                  year(s) from Effective Date
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="confidentialityTermType"
                    value="perpetual"
                    checked={data.confidentialityTermType === 'perpetual'}
                    onChange={() => update('confidentialityTermType', 'perpetual')}
                  />
                  In perpetuity
                </label>
              </div>
            </FormField>

            <FormField label="Governing Law">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Delaware"
                value={data.governingLaw}
                onChange={(e) => update('governingLaw', e.target.value)}
              />
            </FormField>

            <FormField label="Jurisdiction">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. courts located in New Castle, DE"
                value={data.jurisdiction}
                onChange={(e) => update('jurisdiction', e.target.value)}
              />
            </FormField>
          </div>

          {/* Party 1 */}
          <div className="form-section">
            <h2 className="section-heading">Party 1</h2>
            <FormField label="Company">
              <input
                type="text"
                className="form-input"
                placeholder="Acme Corp"
                value={data.party1Company}
                onChange={(e) => update('party1Company', e.target.value)}
              />
            </FormField>
            <FormField label="Signatory Name">
              <input
                type="text"
                className="form-input"
                placeholder="Jane Smith"
                value={data.party1Name}
                onChange={(e) => update('party1Name', e.target.value)}
              />
            </FormField>
            <FormField label="Title">
              <input
                type="text"
                className="form-input"
                placeholder="CEO"
                value={data.party1Title}
                onChange={(e) => update('party1Title', e.target.value)}
              />
            </FormField>
            <FormField label="Notice Address (email or postal)">
              <input
                type="text"
                className="form-input"
                placeholder="jane@acme.com"
                value={data.party1Contact}
                onChange={(e) => update('party1Contact', e.target.value)}
              />
            </FormField>
          </div>

          {/* Party 2 */}
          <div className="form-section">
            <h2 className="section-heading">Party 2</h2>
            <FormField label="Company">
              <input
                type="text"
                className="form-input"
                placeholder="Globex Inc"
                value={data.party2Company}
                onChange={(e) => update('party2Company', e.target.value)}
              />
            </FormField>
            <FormField label="Signatory Name">
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={data.party2Name}
                onChange={(e) => update('party2Name', e.target.value)}
              />
            </FormField>
            <FormField label="Title">
              <input
                type="text"
                className="form-input"
                placeholder="General Counsel"
                value={data.party2Title}
                onChange={(e) => update('party2Title', e.target.value)}
              />
            </FormField>
            <FormField label="Notice Address (email or postal)">
              <input
                type="text"
                className="form-input"
                placeholder="john@globex.com"
                value={data.party2Contact}
                onChange={(e) => update('party2Contact', e.target.value)}
              />
            </FormField>
          </div>
        </aside>

        {/* Preview panel */}
        <main className="preview-panel" ref={previewRef}>
          <div className="document-paper">
            <CoverPagePreview d={data} />
            <hr className="doc-divider" />
            <StandardTermsPreview d={data} />
          </div>
        </main>
      </div>
    </div>
  )
}
