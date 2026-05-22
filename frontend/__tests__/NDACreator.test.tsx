import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NDACreator from '@/app/components/NDACreator'

// window.print is not available in jsdom
beforeEach(() => {
  Object.defineProperty(window, 'print', { value: jest.fn(), writable: true })
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

  it('updates preview when party 1 company is entered', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)

    const allParty1Inputs = screen.getAllByPlaceholderText(/acme/i)
    await user.clear(allParty1Inputs[0])
    await user.type(allParty1Inputs[0], 'TestCorp')

    expect(screen.getByText('TestCorp')).toBeInTheDocument()
  })

  it('updates preview when party 2 company is entered', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)

    const input = screen.getByPlaceholderText('Globex Inc')
    await user.clear(input)
    await user.type(input, 'WidgetCo')

    expect(screen.getByText('WidgetCo')).toBeInTheDocument()
  })

  it('toggles MNDA term to indefinite and updates preview', async () => {
    const user = userEvent.setup()
    const { container } = render(<NDACreator />)

    const indefiniteRadio = container.querySelector<HTMLInputElement>(
      '[name="mndaTermType"][value="indefinite"]'
    )!
    await user.click(indefiniteRadio)

    expect(
      screen.getByText(/continues until terminated in accordance/i)
    ).toBeInTheDocument()
  })

  it('toggles confidentiality term to perpetual and updates preview', async () => {
    const user = userEvent.setup()
    const { container } = render(<NDACreator />)

    const perpetualRadio = container.querySelector<HTMLInputElement>(
      '[name="confidentialityTermType"][value="perpetual"]'
    )!
    await user.click(perpetualRadio)

    expect(screen.getByText('In perpetuity.')).toBeInTheDocument()
  })

  it('shows placeholder in preview when governing law is empty', () => {
    render(<NDACreator />)
    expect(screen.getAllByText('[Governing Law]').length).toBeGreaterThan(0)
  })

  it('shows governing law value in preview after input', async () => {
    const user = userEvent.setup()
    render(<NDACreator />)

    const input = screen.getByPlaceholderText(/e\.g\. delaware/i)
    await user.type(input, 'California')

    expect(screen.getAllByText('California').length).toBeGreaterThan(0)
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
})
