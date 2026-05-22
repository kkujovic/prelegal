import {
  formatDate,
  placeholder,
  mndaTermLabel,
  confidentialityTermLabel,
} from '@/lib/ndaUtils'

describe('formatDate', () => {
  it('returns placeholder for empty string', () => {
    expect(formatDate('')).toBe('[Effective Date]')
  })

  it('returns placeholder for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('[Effective Date]')
  })

  it('formats a valid date in long US format', () => {
    expect(formatDate('2024-06-15')).toBe('June 15, 2024')
  })

  it('handles the first day of the year', () => {
    expect(formatDate('2025-01-01')).toBe('January 1, 2025')
  })
})

describe('placeholder', () => {
  it('returns fallback for empty string', () => {
    expect(placeholder('', '[fallback]')).toBe('[fallback]')
  })

  it('returns fallback for whitespace-only string', () => {
    expect(placeholder('   ', '[fallback]')).toBe('[fallback]')
  })

  it('returns trimmed value for non-empty string', () => {
    expect(placeholder('  hello  ', '[fallback]')).toBe('hello')
  })

  it('returns value unchanged when no trimming needed', () => {
    expect(placeholder('Acme Corp', '[fallback]')).toBe('Acme Corp')
  })
})

describe('mndaTermLabel', () => {
  it('returns fixed term label with given years', () => {
    expect(mndaTermLabel('fixed', '2')).toBe('Expires 2 year(s) from Effective Date.')
  })

  it('defaults to 1 year when years is empty', () => {
    expect(mndaTermLabel('fixed', '')).toBe('Expires 1 year(s) from Effective Date.')
  })

  it('defaults to 1 year when years is 0', () => {
    expect(mndaTermLabel('fixed', '0')).toBe('Expires 1 year(s) from Effective Date.')
  })

  it('defaults to 1 year when years is negative', () => {
    expect(mndaTermLabel('fixed', '-3')).toBe('Expires 1 year(s) from Effective Date.')
  })

  it('returns indefinite label', () => {
    expect(mndaTermLabel('indefinite', '1')).toBe(
      'Continues until terminated in accordance with the terms of the MNDA.'
    )
  })
})

describe('confidentialityTermLabel', () => {
  it('returns fixed term label with given years', () => {
    expect(confidentialityTermLabel('fixed', '3')).toContain('3 year(s) from Effective Date')
  })

  it('defaults to 1 year when years is empty', () => {
    expect(confidentialityTermLabel('fixed', '')).toContain('1 year(s) from Effective Date')
  })

  it('defaults to 1 year when years is 0', () => {
    expect(confidentialityTermLabel('fixed', '0')).toContain('1 year(s) from Effective Date')
  })

  it('defaults to 1 year when years is negative', () => {
    expect(confidentialityTermLabel('fixed', '-1')).toContain('1 year(s) from Effective Date')
  })

  it('returns perpetual label', () => {
    expect(confidentialityTermLabel('perpetual', '1')).toBe('In perpetuity.')
  })
})
