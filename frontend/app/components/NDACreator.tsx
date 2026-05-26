'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatDate, placeholder, mndaTermLabel, confidentialityTermLabel } from '@/lib/ndaUtils'

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

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_NDA: NDAData = {
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: '',
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

const INITIAL_GREETING =
  "Hi! I'll help you create a Mutual Non-Disclosure Agreement. Let's start — what's the purpose of this NDA? For example, are the parties evaluating a business partnership, discussing a technology collaboration, or something else?"

function CoverPagePreview({ d }: { d: NDAData }) {
  const mndaTerm = mndaTermLabel(d.mndaTermType, d.mndaTermYears)
  const confTerm = confidentialityTermLabel(d.confidentialityTermType, d.confidentialityTermYears)

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
          <strong>Introduction.</strong>{' '}This Mutual Non-Disclosure Agreement (which incorporates
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
          <strong>Use and Protection of Confidential Information.</strong>{' '}The Receiving Party
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
          <strong>Exceptions.</strong>{' '}The Receiving Party&rsquo;s obligations in this MNDA do not
          apply to information that it can demonstrate: (a) is or becomes publicly available through
          no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from
          the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from
          a third party without confidentiality restrictions; or (d) it independently developed
          without using or referencing the Confidential Information.
        </li>

        <li>
          <strong>Disclosures Required by Law.</strong>{' '}The Receiving Party may disclose
          Confidential Information to the extent required by law, regulation or regulatory
          authority, subpoena or court order, provided (to the extent legally permitted) it provides
          the Disclosing Party reasonable advance notice of the required disclosure and reasonably
          cooperates, at the Disclosing Party&rsquo;s expense, with the Disclosing Party&rsquo;s
          efforts to obtain confidential treatment for the Confidential Information.
        </li>

        <li>
          <strong>Term and Termination.</strong>{' '}This MNDA commences on the{' '}
          {ref(effectiveDateVal)} and expires at the end of the {ref(mndaTermVal)}. Either party
          may terminate this MNDA for any or no reason upon written notice to the other party. The
          Receiving Party&rsquo;s obligations relating to Confidential Information will survive for
          the {ref(confTermVal)}, despite any expiration or termination of this MNDA.
        </li>

        <li>
          <strong>Return or Destruction of Confidential Information.</strong>{' '}Upon expiration or
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
          <strong>Proprietary Rights.</strong>{' '}The Disclosing Party retains all of its intellectual
          property and other rights in its Confidential Information and its disclosure to the
          Receiving Party grants no license under such rights.
        </li>

        <li>
          <strong>Disclaimer.</strong>{' '}ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;,
          WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE,
          MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
        </li>

        <li>
          <strong>Governing Law and Jurisdiction.</strong>{' '}This MNDA and all matters relating
          hereto are governed by, and construed in accordance with, the laws of the State of{' '}
          {ref(govLawVal)}, without regard to the conflict of laws provisions of such{' '}
          {ref(govLawVal)}. Any legal suit, action, or proceeding relating to this MNDA must be
          instituted in the federal or state courts located in {ref(jurisdictionVal)}. Each party
          irrevocably submits to the exclusive jurisdiction of such {ref(jurisdictionVal)} in any
          such suit, action, or proceeding.
        </li>

        <li>
          <strong>Equitable Relief.</strong>{' '}A breach of this MNDA may cause irreparable harm for
          which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the
          Disclosing Party is entitled to seek appropriate equitable relief, including an
          injunction, in addition to its other remedies.
        </li>

        <li>
          <strong>General.</strong>{' '}Neither party has an obligation under this MNDA to disclose
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

export default function NDACreator() {
  const [data, setData] = useState<NDAData>(() => ({
    ...INITIAL_NDA,
    effectiveDate: new Date().toISOString().split('T')[0],
  }))
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: INITIAL_GREETING },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, current_data: data }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const result = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }])
      setData(result.updated_data)
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="nda-creator">
      <header className="app-header no-print">
        <div className="header-content">
          <div>
            <h1 className="app-title">Mutual NDA Creator</h1>
            <p className="app-subtitle">Chat with the AI to fill in your agreement.</p>
          </div>
          <button onClick={() => window.print()} className="download-btn">
            Download PDF
          </button>
        </div>
      </header>

      <div className="main-layout">
        <aside className="chat-panel no-print">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message chat-message--${msg.role}`}>
                <div className="chat-bubble">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-bubble chat-bubble--loading">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </aside>

        <main className="preview-panel">
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
