'use client'

import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Card, Flex, Heading, Inline, Spinner, Stack, Text, TextArea } from '@sanity/ui'
import { TagIcon } from '@sanity/icons'
import { useClient } from 'sanity'
import { apiVersion } from '../env'
import { colourFromFilename, normColour } from '@/lib/util/colour'

type StockRow = {
  model: string
  color: string
  mrp: number
}

type ProductDoc = {
  _id: string
  name: string
  price: number | null
  colourNames: (string | null)[]
  colourImageNames: (string | null)[]
  lifestyleImageNames: (string | null)[]
}

type MatchRow = {
  model: string
  price: number
  ids: string[]
  currentPrices: (number | null)[]
  status: 'matched' | 'not-found'
  matchedColours: string[]
  source: 'photo' | 'sheet' | 'none'
}

/** Split a pasted row on tabs (Excel paste), falling back to commas or runs of spaces. */
function splitRow(line: string): string[] {
  if (line.includes('\t')) return line.split('\t')
  if (line.includes(',')) return line.split(',')
  return line.split(/\s{2,}/)
}

/**
 * Parse a pasted stock sheet into one row per model+colour.
 *
 * Looks for a header row containing "MODEL NO" and "MRP" columns (any
 * surrounding blank columns are fine, "COLOR"/"COLOUR" is read if present),
 * then reads those columns from every row after it. Rows without a model
 * name (totals rows, blank rows) are skipped.
 */
function parseStockSheet(text: string): { rows: StockRow[]; error?: string } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== '')
  if (lines.length === 0) return { rows: [], error: 'Paste your stock sheet first.' }

  let modelIdx = -1
  let colorIdx = -1
  let mrpIdx = -1
  let headerLineIdx = -1

  for (let i = 0; i < lines.length; i++) {
    const cells = splitRow(lines[i]).map((c) => c.trim().toUpperCase())
    const m = cells.indexOf('MODEL NO')
    const p = cells.indexOf('MRP')
    if (m !== -1 && p !== -1) {
      modelIdx = m
      mrpIdx = p
      colorIdx = cells.indexOf('COLOR') !== -1 ? cells.indexOf('COLOR') : cells.indexOf('COLOUR')
      headerLineIdx = i
      break
    }
  }

  if (headerLineIdx === -1) {
    return { rows: [], error: 'Could not find a header row with "MODEL NO" and "MRP" columns.' }
  }

  const rows: StockRow[] = []
  for (let i = headerLineIdx + 1; i < lines.length; i++) {
    const cells = splitRow(lines[i]).map((c) => c.trim())
    const model = (cells[modelIdx] ?? '').trim()
    const mrpRaw = (cells[mrpIdx] ?? '').trim()
    if (!model) continue
    const mrp = Number(mrpRaw)
    if (!Number.isFinite(mrp) || mrp <= 0) continue
    const color = colorIdx !== -1 ? (cells[colorIdx] ?? '').trim() : ''
    rows.push({ model: model.toUpperCase(), color, mrp })
  }

  return { rows }
}

/**
 * Pick the MRP for a model: prefer rows whose colour matches one of the
 * product's actual colour photos (lifestyle photo filenames / colour names),
 * falling back to the most common MRP across all of that model's rows.
 */
function pickPrice(
  modelRows: StockRow[],
  candidates: string[]
): { price: number; matchedColours: string[]; source: 'photo' | 'sheet' } {
  const normCandidates = Array.from(new Set(candidates.map(normColour).filter(Boolean)))

  let matched = modelRows.filter((r) => normCandidates.includes(normColour(r.color)))
  if (matched.length === 0) {
    matched = modelRows.filter((r) => {
      const rc = normColour(r.color)
      return rc !== '' && normCandidates.some((c) => rc.includes(c) || c.includes(rc))
    })
  }

  const pool = matched.length > 0 ? matched : modelRows
  const counts = new Map<number, number>()
  for (const r of pool) counts.set(r.mrp, (counts.get(r.mrp) ?? 0) + 1)
  let best = pool[0].mrp
  let bestCount = 0
  for (const [mrp, count] of counts) {
    if (count > bestCount) {
      best = mrp
      bestCount = count
    }
  }

  return {
    price: Math.round(best),
    matchedColours: Array.from(new Set(matched.map((r) => r.color).filter(Boolean))),
    source: matched.length > 0 ? 'photo' : 'sheet',
  }
}

export function PriceImportTool() {
  const client = useClient({ apiVersion })
  const [text, setText] = useState('')
  const [matches, setMatches] = useState<MatchRow[] | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [applyResult, setApplyResult] = useState<{ updated: number } | null>(null)
  const [applyError, setApplyError] = useState<string | null>(null)

  const summary = useMemo(() => {
    if (!matches) return null
    const matched = matches.filter((m) => m.status === 'matched')
    const notFound = matches.filter((m) => m.status === 'not-found')
    const changed = matched.filter((m) => m.ids.length > 0 && m.currentPrices.some((p) => p !== m.price))
    return { matched: matched.length, notFound: notFound.length, changed: changed.length, total: matches.length }
  }, [matches])

  const preview = useCallback(async () => {
    setBusy(true)
    setParseError(null)
    setMatches(null)
    setApplyResult(null)
    setApplyError(null)
    try {
      const { rows, error } = parseStockSheet(text)
      if (error) {
        setParseError(error)
        return
      }
      if (rows.length === 0) {
        setParseError('No model + MRP rows found under the header.')
        return
      }

      const products = await client.fetch<ProductDoc[]>(
        `*[_type == "product"]{
          _id,
          name,
          price,
          "colourNames": colours[].name,
          "colourImageNames": colours[].image.asset->originalFilename,
          "lifestyleImageNames": lifestyleImages[].asset->originalFilename
        }`
      )

      const byName = new Map<string, ProductDoc[]>()
      for (const p of products) {
        const key = String(p.name ?? '').trim().toUpperCase()
        if (!byName.has(key)) byName.set(key, [])
        byName.get(key)!.push(p)
      }

      const byModel = new Map<string, StockRow[]>()
      const order: string[] = []
      for (const r of rows) {
        if (!byModel.has(r.model)) {
          byModel.set(r.model, [])
          order.push(r.model)
        }
        byModel.get(r.model)!.push(r)
      }

      const out: MatchRow[] = order.map((model) => {
        const modelRows = byModel.get(model)!
        const docs = byName.get(model) ?? []

        if (docs.length === 0) {
          return {
            model,
            price: Math.round(modelRows[0].mrp),
            ids: [],
            currentPrices: [],
            status: 'not-found',
            matchedColours: [],
            source: 'none',
          }
        }

        const candidates: string[] = []
        for (const d of docs) {
          for (const name of d.colourNames ?? []) if (name) candidates.push(name)
          for (const fn of [...(d.colourImageNames ?? []), ...(d.lifestyleImageNames ?? [])]) {
            if (fn) candidates.push(colourFromFilename(fn, model))
          }
        }

        const { price, matchedColours, source } = pickPrice(modelRows, candidates)

        return {
          model,
          price,
          ids: docs.map((d) => d._id),
          currentPrices: docs.map((d) => d.price),
          status: 'matched',
          matchedColours,
          source,
        }
      })

      setMatches(out)
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Could not parse that sheet.')
    } finally {
      setBusy(false)
    }
  }, [text, client])

  const apply = useCallback(async () => {
    if (!matches) return
    setBusy(true)
    setApplyError(null)
    setApplyResult(null)
    try {
      const toUpdate = matches.filter((m) => m.ids.length > 0)
      if (toUpdate.length === 0) {
        setApplyResult({ updated: 0 })
        return
      }
      const tx = client.transaction()
      let count = 0
      for (const m of toUpdate) {
        for (const id of m.ids) {
          tx.patch(id, (p) => p.set({ price: m.price }))
          count++
        }
      }
      await tx.commit()
      setApplyResult({ updated: count })
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Could not save prices.')
    } finally {
      setBusy(false)
    }
  }, [matches, client])

  return (
    <Box padding={4} style={{ maxWidth: 820, margin: '0 auto' }}>
      <Stack space={5}>
        <Stack space={3}>
          <Inline space={2}>
            <TagIcon style={{ fontSize: 28 }} />
            <Heading size={3}>Price import</Heading>
          </Inline>
          <Text size={1} muted>
            Paste your stock sheet below - copy the rows straight from Excel/Sheets, including the
            header row with <strong>MODEL NO</strong>, <strong>Color</strong> and <strong>MRP</strong>{' '}
            columns. For each model, the price from the row whose colour matches one of that
            product&apos;s lifestyle photos is used (e.g. a photo named &quot;Luna-Transparent
            Green.png&quot; maps to the TRANSPARENT GREEN row&apos;s MRP). If no photo match is
            found, the most common MRP for that model is used instead. Prices are rounded to the
            nearest rupee.
          </Text>
        </Stack>

        <Card padding={4} radius={3} border>
          <Stack space={4}>
            <Text weight="semibold">1. Paste your sheet</Text>
            <TextArea
              rows={12}
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              placeholder={'MODEL NO\tColor\tQTY\tQTY Procured\tMRP\nLUNA\tTRANSPARENT GREEN\t37\t50\t3262.5\n…'}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
            <Flex align="center" gap={3}>
              <Button
                text={busy ? 'Working…' : 'Preview'}
                tone="primary"
                disabled={busy || !text.trim()}
                onClick={preview}
              />
              {busy && <Spinner muted />}
            </Flex>
          </Stack>
        </Card>

        {parseError && (
          <Card padding={4} radius={3} tone="critical" border>
            <Text size={1}>{parseError}</Text>
          </Card>
        )}

        {summary && matches && (
          <Card padding={4} radius={3} tone={summary.notFound ? 'caution' : 'positive'} border>
            <Stack space={4}>
              <Text weight="semibold">
                {summary.matched} matched · {summary.notFound} not found (of {summary.total} models) ·{' '}
                {summary.changed} price{summary.changed === 1 ? '' : 's'} will change
              </Text>

              <Stack space={3}>
                {matches.map((m) => (
                  <Flex key={m.model} justify="space-between" align="flex-start">
                    <Stack space={1}>
                      <Text size={1} weight="semibold">
                        {m.model}
                      </Text>
                      {m.status === 'matched' && m.source === 'photo' && (
                        <Text size={0} muted>
                          matched via photo colour: {m.matchedColours.join(', ')}
                        </Text>
                      )}
                      {m.status === 'matched' && m.source === 'sheet' && (
                        <Text size={0} muted>
                          no photo colour match - used most common sheet price
                        </Text>
                      )}
                    </Stack>
                    <Text size={1} muted={m.status === 'not-found'}>
                      {m.status === 'not-found'
                        ? 'No matching product'
                        : `${m.currentPrices.map((p) => (p == null ? '-' : `₹${p}`)).join(', ')} → ₹${m.price}`}
                    </Text>
                  </Flex>
                ))}
              </Stack>

              <Box>
                <Button
                  text={busy ? 'Saving…' : `Apply ${summary.changed || summary.matched} price update${summary.matched === 1 ? '' : 's'}`}
                  tone="positive"
                  disabled={busy || summary.matched === 0}
                  onClick={apply}
                />
              </Box>
            </Stack>
          </Card>
        )}

        {applyError && (
          <Card padding={4} radius={3} tone="critical" border>
            <Text size={1}>{applyError}</Text>
          </Card>
        )}

        {applyResult && (
          <Card padding={4} radius={3} tone="positive" border>
            <Text size={1}>Updated price on {applyResult.updated} product document(s).</Text>
          </Card>
        )}
      </Stack>
    </Box>
  )
}

export default PriceImportTool
