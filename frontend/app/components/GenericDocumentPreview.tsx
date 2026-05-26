'use client'

export interface FieldDef {
  key: string
  label: string
  description: string
  default: string
}

interface Props {
  documentName: string
  fields: Record<string, string>
  fieldDefs: FieldDef[]
}

function val(fields: Record<string, string>, key: string, label: string): string {
  return fields[key]?.trim() || `[${label}]`
}

export default function GenericDocumentPreview({ documentName, fields, fieldDefs }: Props) {
  return (
    <div className="document-section">
      <h1 className="doc-title">{documentName}</h1>

      <div className="usage-box">
        <p>
          This document incorporates the <strong>{documentName}</strong> standard terms. Fill in the
          fields via the chat to complete your agreement.
        </p>
      </div>

      <table className="cover-table">
        <tbody>
          {fieldDefs.map((f) => (
            <tr key={f.key}>
              <td className="field-label">
                <strong>{f.label}</strong>
                {f.description && <span className="field-hint">{f.description}</span>}
              </td>
              <td className="field-value">{val(fields, f.key, f.label)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="cc-notice">Common Paper {documentName} free to use under CC BY 4.0.</p>
    </div>
  )
}
