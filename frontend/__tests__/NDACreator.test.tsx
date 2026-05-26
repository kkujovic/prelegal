import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NDACreator from '@/app/components/NDACreator'

const defaultUpdatedData = {
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

function mockFetch(reply = 'Got it, thanks!', overrides = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ reply, updated_data: { ...defaultUpdatedData, ...overrides } }),
  } as Response)
}

beforeEach(() => {
  Object.defineProperty(window, 'print', { value: jest.fn(), writable: true })
  mockFetch()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('NDACreator', () => {
  it('renders the app title', () => {
    render(<NDACreator />)
    expect(screen.getByText('Mutual NDA Creator')).toBeInTheDocument()
  })

  it('renders the Download PDF button', () => {
    render(<NDACreator />)
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
  })

  it('renders the document title in the preview', () => {
    render(<NDACreator />)
    expect(
      screen.getByRole('heading', { name: /mutual non-disclosure agreement/i, level: 1 })
    ).toBeInTheDocument()
  })

  it('shows Standard Terms heading in preview', () => {
    render(<NDACreator />)
    expect(screen.getByRole('heading', { name: /standard terms/i })).toBeInTheDocument()
  })

  it('calls window.print when Download PDF is clicked', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)
    await user.click(screen.getByRole('button', { name: /download pdf/i }))
    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it('defaults effective date to today', () => {
    render(<NDACreator />)
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(screen.getAllByText(today).length).toBeGreaterThan(0)
  })

  it('shows initial AI greeting in chat panel', () => {
    render(<NDACreator />)
    expect(
      screen.getByText(/I'll help you create a Mutual Non-Disclosure Agreement/i)
    ).toBeInTheDocument()
  })

  it('renders chat input and send button', () => {
    render(<NDACreator />)
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('send button is disabled when input is empty', () => {
    render(<NDACreator />)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('send button is enabled when input has text', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Hello')
    expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled()
  })

  it('appends user message to chat on send', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Acme and Globex are partners')
    await user.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByText('Acme and Globex are partners')).toBeInTheDocument()
  })

  it('shows AI reply after sending a message', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByText('Got it, thanks!')).toBeInTheDocument()
    })
  })

  it('clears the input after sending', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)
    const input = screen.getByPlaceholderText(/type a message/i)
    await user.type(input, 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))
    expect(input).toHaveValue('')
  })

  it('sends NDA data and messages to the chat API', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Technology partnership')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(url).toBe('/api/chat')
    expect(options.method).toBe('POST')

    const body = JSON.parse(options.body)
    expect(body.messages).toBeInstanceOf(Array)
    expect(body.messages.at(-1)).toMatchObject({ role: 'user', content: 'Technology partnership' })
    expect(body.current_data).toBeDefined()
  })

  it('updates document preview with data returned from API', async () => {
    mockFetch('Noted!', {
      governingLaw: 'Delaware',
      jurisdiction: 'courts in New Castle County, Delaware',
      party1Company: 'Acme Corp',
    })

    const user = userEvent.setup()
    render(<NDACreator />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Acme Corp, Delaware')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    })
    expect(screen.getAllByText('Delaware').length).toBeGreaterThan(0)
  })

  it('shows error message in chat when API call fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))
    const user = userEvent.setup()
    render(<NDACreator />)
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })
})
