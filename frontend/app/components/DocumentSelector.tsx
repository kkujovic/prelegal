'use client'

import { useEffect, useState } from 'react'

export interface CatalogEntry {
  name: string
  description: string
  filename: string
}

interface SavedDocument {
  id: number
  document_type: string
  fields: Record<string, string>
  created_at: string
  updated_at: string
}

interface Props {
  token: string
  email: string
  onSelect: (entry: CatalogEntry) => void
  onResume: (entry: CatalogEntry, documentId: number, initialFields: Record<string, string>) => void
  onSignOut: () => void
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function DocumentSelector({ token, email, onSelect, onResume, onSignOut }: Props) {
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((data) => setCatalog(data.filter((e: CatalogEntry) => e.name !== 'Mutual NDA Cover Page')))
      .catch(() => setError(true))
  }, [])

  useEffect(() => {
    fetch('/api/documents', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((docs) => setSavedDocs(docs))
      .catch(() => {})
  }, [token])

  function handleResume(doc: SavedDocument) {
    const entry = catalog.find((e) => e.name === doc.document_type)
    if (!entry) return
    onResume(entry, doc.id, doc.fields)
  }

  const docsWithFields = savedDocs.filter(
    (d) => Object.values(d.fields).some((v) => v && v.trim()),
  )

  return (
    <div className="doc-selector">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">Prelegal</h1>
            <p className="app-subtitle">AI-powered legal document creator</p>
          </div>
          <div className="header-user">
            <span className="header-email">{email}</span>
            <button className="signout-btn" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="selector-content">
        {docsWithFields.length > 0 && (
          <section className="history-section">
            <h2 className="section-heading">My Documents</h2>
            <div className="history-list">
              {docsWithFields.map((doc) => (
                <button key={doc.id} className="history-card" onClick={() => handleResume(doc)}>
                  <div className="history-card-title">{doc.document_type}</div>
                  <div className="history-card-date">{formatDateTime(doc.updated_at)}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="section-heading">New Document</h2>
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
        </section>
      </div>
    </div>
  )
}
