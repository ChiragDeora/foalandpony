'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Code,
  Flex,
  Heading,
  Inline,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui'
import { DocumentsIcon, DownloadIcon, UploadIcon } from '@sanity/icons'
import { useClient } from 'sanity'
import { apiVersion } from '../env'

// xlsx is heavy and references node-ish globals; load it only when needed
// (on download / upload) so the tool mounts instantly inside the Studio.
async function loadXLSX() {
  return (await import('xlsx')) as typeof import('xlsx')
}

/* ------------------------------------------------------------------ */
/* Column spec — keep in sync with sanity/schemas/product.ts          */
/* ------------------------------------------------------------------ */

const TEMPLATE_HEADERS = [
  'name',
  'tagline',
  'price',
  'description',
  'ageBand',
  'shape',
  'sizeCode',
  'technology',
  'colours',
  'published',
  'featured',
  'order',
] as const

const TEMPLATE_EXAMPLE = [
  'LUNA',
  'Featherlight everyday round',
  '1499',
  'Built for first-glasses kids. Bends through playground tumbles and stays put through every cartwheel.',
  '4-7',
  'round',
  '45-16-130',
  'soft-flex',
  'Midnight:#1F3A5C; Sky Blue:#7BABE0; Coral:#D2766E',
  'true',
  'false',
  '10',
]

const AGE_BANDS = ['4-7', '8-12', '13+']
const SHAPES = ['round', 'oval', 'square', 'rectangle', 'panto', 'wayfarer']
const TECHS = ['nose-pad', 'soft-flex', 'medium-flex', 'polarised-clip-on']

// Studio shows friendly labels (e.g. "Soft flex") but stores hyphenated values
// (e.g. "soft-flex"). Accept either, plus loose variants like "Special nose pad".
const TECH_ALIASES: Record<string, string> = {
  'special nose pad': 'nose-pad',
  'nose pad': 'nose-pad',
  'soft flex': 'soft-flex',
  'medium flex': 'medium-flex',
  'polarised clip-on': 'polarised-clip-on',
  'polarised clip on': 'polarised-clip-on',
  'polarized clip-on': 'polarised-clip-on',
  'polarized clip on': 'polarised-clip-on',
}

type RowResult = {
  row: number
  name: string
  status: 'created' | 'error'
  message?: string
}

function randKey() {
  return Math.random().toString(36).slice(2, 12)
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function truthy(value: unknown) {
  const s = String(value ?? '').trim().toLowerCase()
  return s === 'true' || s === '1' || s === 'yes' || s === 'y'
}

/** Map a "technology" cell (label or value, any case/spacing) to its schema value. */
function normaliseTech(value: unknown): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const lower = raw.toLowerCase()
  if (TECHS.includes(lower)) return lower
  if (TECH_ALIASES[lower]) return TECH_ALIASES[lower]
  const hyphenated = lower.replace(/\s+/g, '-')
  if (TECHS.includes(hyphenated)) return hyphenated
  return lower
}

/** Normalise an age band cell into one of the schema values. */
function normaliseAge(value: unknown): string | null {
  const s = String(value ?? '').toLowerCase().replace(/\s/g, '')
  if (!s) return null
  if (s.includes('13')) return '13+'
  if (s.includes('8')) return '8-12'
  if (s.includes('4')) return '4-7'
  return null
}

/** Build the portable-text description from a plain-text cell. */
function toBlocks(text: string) {
  const trimmed = String(text ?? '').trim()
  if (!trimmed) return undefined
  return trimmed
    .split(/\n+/)
    .filter(Boolean)
    .map((para) => ({
      _type: 'block',
      _key: randKey(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: randKey(), text: para.trim(), marks: [] }],
    }))
}

/** Parse a "Name:#hex; Name2:#hex2" cell into colour objects. */
function parseColours(value: unknown): { ok: { _key: string; _type: 'colour'; name: string; hex: string }[]; errors: string[] } {
  const ok: { _key: string; _type: 'colour'; name: string; hex: string }[] = []
  const errors: string[] = []
  const raw = String(value ?? '').trim()
  if (!raw) return { ok, errors }
  for (const part of raw.split(/[;\n]+/)) {
    const chunk = part.trim()
    if (!chunk) continue
    const idx = chunk.lastIndexOf(':')
    if (idx === -1) {
      errors.push(`"${chunk}" is missing a hex (use Name:#hex)`)
      continue
    }
    const name = chunk.slice(0, idx).trim()
    let hex = chunk.slice(idx + 1).trim()
    if (hex && !hex.startsWith('#')) hex = `#${hex}`
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      errors.push(`"${name}" has an invalid hex "${hex}"`)
      continue
    }
    ok.push({ _key: randKey(), _type: 'colour', name, hex })
  }
  return { ok, errors }
}

/** Lowercase + trim every header key on a parsed row. */
function normaliseRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(row)) {
    out[k.trim().toLowerCase()] = v
  }
  return out
}

export function BulkImportTool() {
  const client = useClient({ apiVersion })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<RowResult[] | null>(null)
  const [topError, setTopError] = useState<string | null>(null)

  const summary = useMemo(() => {
    if (!results) return null
    const created = results.filter((r) => r.status === 'created').length
    const failed = results.length - created
    return { created, failed, total: results.length }
  }, [results])

  const downloadTemplate = useCallback(async () => {
    const XLSX = await loadXLSX()
    const ws = XLSX.utils.aoa_to_sheet([
      TEMPLATE_HEADERS as unknown as string[],
      TEMPLATE_EXAMPLE,
    ])
    ws['!cols'] = TEMPLATE_HEADERS.map(() => ({ wch: 22 }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, 'foalandpony-product-template.xlsx')
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      setBusy(true)
      setResults(null)
      setTopError(null)
      try {
        const XLSX = await loadXLSX()
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: '',
        })

        if (rows.length === 0) {
          setTopError('That sheet has no data rows. Add at least one product under the header row.')
          setBusy(false)
          return
        }

        const docs: Record<string, unknown>[] = []
        const out: RowResult[] = []

        rows.forEach((rawRow, i) => {
          const rowNo = i + 2 // +1 for header, +1 for 1-based
          const r = normaliseRow(rawRow)
          const name = String(r['name'] ?? '').trim()

          if (!name) {
            out.push({ row: rowNo, name: '(blank)', status: 'error', message: 'Missing "name"' })
            return
          }

          const ageBand = normaliseAge(r['ageband'])
          if (!ageBand) {
            out.push({
              row: rowNo,
              name,
              status: 'error',
              message: `Missing or invalid "ageBand" (use one of ${AGE_BANDS.join(', ')})`,
            })
            return
          }

          const shape = String(r['shape'] ?? '').trim().toLowerCase()
          if (shape && !SHAPES.includes(shape)) {
            out.push({ row: rowNo, name, status: 'error', message: `Invalid shape "${shape}"` })
            return
          }

          const techRaw = String(r['technology'] ?? '').trim()
          const tech = normaliseTech(techRaw)
          if (tech && !TECHS.includes(tech)) {
            out.push({ row: rowNo, name, status: 'error', message: `Invalid technology "${techRaw}"` })
            return
          }

          const price = Number(r['price'])
          if (!Number.isFinite(price) || price <= 0) {
            out.push({ row: rowNo, name, status: 'error', message: 'Missing or invalid "price"' })
            return
          }

          const { ok: colours, errors: colourErrors } = parseColours(r['colours'])
          if (colourErrors.length) {
            out.push({ row: rowNo, name, status: 'error', message: colourErrors.join('; ') })
            return
          }

          const orderRaw = r['order']
          const order = Number(orderRaw)

          const doc: Record<string, unknown> = {
            _type: 'product',
            name,
            slug: { _type: 'slug', current: slugify(name) },
            ageBand,
            price,
            published: truthy(r['published']),
            featured: truthy(r['featured']),
            order: Number.isFinite(order) && String(orderRaw).trim() !== '' ? order : 100,
          }

          const tagline = String(r['tagline'] ?? '').trim()
          if (tagline) doc.tagline = tagline

          const blocks = toBlocks(String(r['description'] ?? ''))
          if (blocks) doc.description = blocks

          if (shape) doc.shape = shape
          const sizeCode = String(r['sizecode'] ?? '').trim()
          if (sizeCode) doc.sizeCode = sizeCode
          if (tech) doc.technology = tech
          if (colours.length) doc.colours = colours

          docs.push(doc)
          out.push({ row: rowNo, name, status: 'created' })
        })

        // Commit the valid docs in one transaction.
        const valid = docs
        if (valid.length) {
          const tx = client.transaction()
          valid.forEach((d) => tx.create(d as Parameters<typeof tx.create>[0]))
          await tx.commit()
        }

        setResults(out)
      } catch (err) {
        setTopError(err instanceof Error ? err.message : 'Could not read that file.')
      } finally {
        setBusy(false)
      }
    },
    [client]
  )

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setFileName(file.name)
      void handleFile(file)
      // allow re-picking the same file
      e.target.value = ''
    },
    [handleFile]
  )

  return (
    <Box padding={4} style={{ maxWidth: 820, margin: '0 auto' }}>
      <Stack space={5}>
        <Stack space={3}>
          <Inline space={2}>
            <DocumentsIcon style={{ fontSize: 28 }} />
            <Heading size={3}>Bulk import products</Heading>
          </Inline>
          <Text size={1} muted>
            Upload an Excel (.xlsx) or CSV file and one product is created per row. Start from the
            template so the columns line up. Frame photos are added per product in the editor after
            import.
          </Text>
        </Stack>

        <Card padding={4} radius={3} tone="primary" border>
          <Stack space={4}>
            <Text weight="semibold">1. Get the template</Text>
            <Text size={1} muted>
              The template has every column with one example row. Fill in your products, then delete
              the example.
            </Text>
            <Box>
              <Button
                icon={DownloadIcon}
                text="Download template (.xlsx)"
                tone="primary"
                mode="ghost"
                onClick={downloadTemplate}
              />
            </Box>
          </Stack>
        </Card>

        <Card padding={4} radius={3} border>
          <Stack space={4}>
            <Text weight="semibold">2. Upload your file</Text>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={onPick}
              style={{ display: 'none' }}
            />
            <Flex align="center" gap={3}>
              <Button
                icon={UploadIcon}
                text={busy ? 'Importing…' : 'Choose Excel / CSV file'}
                tone="positive"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
              />
              {busy && <Spinner muted />}
              {fileName && !busy && (
                <Text size={1} muted>
                  {fileName}
                </Text>
              )}
            </Flex>
          </Stack>
        </Card>

        {topError && (
          <Card padding={4} radius={3} tone="critical" border>
            <Text size={1}>{topError}</Text>
          </Card>
        )}

        {summary && (
          <Card padding={4} radius={3} tone={summary.failed ? 'caution' : 'positive'} border>
            <Stack space={4}>
              <Text weight="semibold">
                {summary.created} created · {summary.failed} skipped (of {summary.total} rows)
              </Text>
              {results && results.some((r) => r.status === 'error') && (
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    Rows that need attention:
                  </Text>
                  {results
                    .filter((r) => r.status === 'error')
                    .map((r) => (
                      <Text key={r.row} size={1}>
                        Row {r.row} ({r.name}): {r.message}
                      </Text>
                    ))}
                </Stack>
              )}
              {summary.created > 0 && (
                <Text size={1} muted>
                  Imported products land as drafts unless “published” was TRUE. Find them under
                  Catalogue → All products.
                </Text>
              )}
            </Stack>
          </Card>
        )}

        <Card padding={4} radius={3} tone="transparent" border>
          <Stack space={3}>
            <Text weight="semibold" size={1}>
              Column reference
            </Text>
            <Text size={1} muted>
              <strong>name</strong> (required) · <strong>ageBand</strong> (required: 4-7, 8-12, 13+)
              · <strong>price</strong> (required, whole rupees) · tagline · description (plain
              text) · shape ({SHAPES.join(', ')}) · sizeCode (e.g. 45-16-130) · technology (
              {TECHS.join(', ')}) · published / featured (true/false) · order (number).
            </Text>
            <Text size={1} muted>
              colours - semicolon-separated <code>Name:#hex</code> pairs, e.g.
            </Text>
            <Code size={1}>Midnight:#1F3A5C; Sky Blue:#7BABE0; Coral:#D2766E</Code>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}

export default BulkImportTool
