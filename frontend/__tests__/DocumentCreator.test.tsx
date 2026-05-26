import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DocumentCreator from '@/app/components/DocumentCreator'
import { CatalogEntry } from '@/app/components/DocumentSelector'

const NDA_DOC: CatalogEntry = {
  name: 'Mutual NDA',
  description: 'Mutual Non-Disclosure Agreement',
  filename: 'templates/Mutual-NDA.md',
}

const NDA_FIELD_DEFS = [
  { key: 'purpose', label: 'Purpose', description: 'How parties use confidential info', default: 'Evaluating whether to enter into a business relationship with the other party.' },
  { key: 'effectiveDate', label: 'Effective Date', description: 'Start date', default: '' },
  { key: 'mndaTermType', label: 'MNDA Term Type', description: 'fixed or indefinite', default: 'fixed' },
  { key: 'mndaTermYears', label: 'MNDA Term Years', description: 'Years', default: '1' },
  { key: 'confidentialityTermType', label: 'Confidentiality Term Type', description: 'fixed or perpetual', default: 'fixed' },
  { key: 'confidentialityTermYears', label: 'Confidentiality Term Years', description: 'Years', default: '1' },
  { key: 'governingLaw', label: 'Governing Law', description: 'US state', default: '' },
  { key: 'jurisdiction', label: 'Jurisdiction', description: 'Courts', default: '' },
  { key: 'party1Company', label: 'Party 1 Company', description: 'First party company', default: '' },
  { key: 'party1Name', label: 'Party 1 Name', description: 'First party name', default: '' },
  { key: 'party1Title', label: 'Party 1 Title', description: 'First party title', default: '' },
  { key: 'party1Contact', label: 'Party 1 Notice Address', description: 'First party contact', default: '' },
  { key: 'party2Company', label: 'Party 2 Company', description: 'Second party company', default: '' },
  { key: 'party2Name', label: 'Party 2 Name', description: 'Second party name', default: '' },
  { key: 'party2Title', label: 'Party 2 Title', description: 'Second party title', default: '' },
  { key: 'party2Contact', label: 'Party 2 Notice Address', description: 'Second party contact', default: '' },
]

const DEFAULT_FIELDS: Record<string, string> = {
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

function mockFetch(reply = 'Got it, thanks!', fieldOverrides: Record<string, string> = {}) {
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes('/api/fields/')) {
      return Promise.resolve({
        ok: true,
        json: async () => NDA_FIELD_DEFS,
      } as Response)
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({ reply, updated_fields: { ...DEFAULT_FIELDS, ...fieldOverrides } }),
    } as Response)
  })
}

beforeEach(() => {
  Object.defineProperty(window, 'print', { value: jest.fn(), writable: true })
  mockFetch()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('DocumentCreator (Mutual NDA)', () => {
  it('renders the document name as title', () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    expect(screen.getByText('Mutual NDA')).toBeInTheDocument()
  })

  it('renders the Download PDF button', () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
  })

  it('renders the document title in the NDA preview', () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    expect(
      screen.getByRole('heading', { name: /mutual non-disclosure agreement/i, level: 1 })
    ).toBeInTheDocument()
  })

  it('shows Standard Terms heading in NDA preview', () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    expect(screen.getByRole('heading', { name: /standard terms/i })).toBeInTheDocument()
  })

  it('calls window.print when Download PDF is clicked', async () => {
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    await user.click(screen.getByRole('button', { name: /download pdf/i }))
    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it('defaults effective date to today after fields load', async () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    await waitFor(() => {
      expect(screen.getAllByText(today).length).toBeGreaterThan(0)
    })
  })

  it('shows initial AI greeting in chat panel', () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    expect(
      screen.getByText(/I'll help you create a Mutual Non-Disclosure Agreement/i)
    ).toBeInTheDocument()
  })

  it('renders chat input and send button', () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('send button is disabled when input is empty', () => {
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('send button is enabled when input has text', async () => {
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Hello')
    expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled()
  })

  it('appends user message to chat on send', async () => {
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Acme and Globex are partners')
    await user.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByText('Acme and Globex are partners')).toBeInTheDocument()
  })

  it('shows AI reply after sending a message', async () => {
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByText('Got it, thanks!')).toBeInTheDocument()
    })
  })

  it('clears the input after sending', async () => {
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    const input = screen.getByPlaceholderText(/type a message/i)
    await user.type(input, 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))
    expect(input).toHaveValue('')
  })

  it('sends document type, fields, and messages to the chat API', async () => {
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Technology partnership')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      const chatCalls = (global.fetch as jest.Mock).mock.calls.filter(
        ([url]: [string]) => url === '/api/chat'
      )
      expect(chatCalls.length).toBe(1)
      const [, options] = chatCalls[0]
      const body = JSON.parse(options.body)
      expect(body.document_type).toBe('Mutual NDA')
      expect(body.messages).toBeInstanceOf(Array)
      expect(body.messages.at(-1)).toMatchObject({ role: 'user', content: 'Technology partnership' })
      expect(body.fields).toBeDefined()
    })
  })

  it('updates document preview with data returned from API', async () => {
    mockFetch('Noted!', {
      governingLaw: 'Delaware',
      jurisdiction: 'courts in New Castle County, Delaware',
      party1Company: 'Acme Corp',
    })

    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Acme Corp, Delaware')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    })
    expect(screen.getAllByText('Delaware').length).toBeGreaterThan(0)
  })

  it('shows error message in chat when API call fails', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/fields/')) {
        return Promise.resolve({ ok: true, json: async () => NDA_FIELD_DEFS } as Response)
      }
      return Promise.reject(new Error('Network error'))
    })
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={jest.fn()} />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('calls onBack when back button is clicked', async () => {
    const onBack = jest.fn()
    const user = userEvent.setup()
    render(<DocumentCreator document={NDA_DOC} onBack={onBack} />)
    await user.click(screen.getByRole('button', { name: /documents/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
