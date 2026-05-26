'use client'

import { useState } from 'react'
import DocumentSelector, { CatalogEntry } from './components/DocumentSelector'
import DocumentCreator from './components/DocumentCreator'

export default function Page() {
  const [selectedDoc, setSelectedDoc] = useState<CatalogEntry | null>(null)

  if (selectedDoc) {
    return <DocumentCreator document={selectedDoc} onBack={() => setSelectedDoc(null)} />
  }
  return <DocumentSelector onSelect={setSelectedDoc} />
}
