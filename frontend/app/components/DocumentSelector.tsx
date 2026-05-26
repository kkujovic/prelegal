'use client'

import { useEffect, useState } from 'react'

export interface CatalogEntry {
  name: string
  description: string
  filename: string
}

interface Props {
  onSelect: (entry: CatalogEntry) => void
}

export default function DocumentSelector({ onSelect }: Props) {
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((data) => setCatalog(data.filter((e: CatalogEntry) => e.name !== 'Mutual NDA Cover Page')))
      .catch(() => setError(true))
  }, [])

  return (
    <div className="doc-selector">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">Prelegal</h1>
            <p className="app-subtitle">AI-powered legal document creator</p>
          </div>
        </div>
      </header>

      <div className="selector-content">
        <p className="selector-intro">
          Choose a document type to get started. Our AI will guide you through filling it in.
        </p>

        {error && (
          <p className="selector-error">Could not load documents. Is the backend running?</p>
        )}

        <div className="catalog-grid">
          {catalog.map((entry) => (
            <button key={entry.name} className="catalog-card" onClick={() => onSelect(entry)}>
              <div className="catalog-card-title">{entry.name}</div>
              <div className="catalog-card-desc">{entry.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
