'use client'

import { useCallback, useState } from 'react'
import { Box, Button, Card, Flex, Heading, Inline, Spinner, Stack, Text } from '@sanity/ui'
import { DropIcon } from '@sanity/icons'
import { useClient } from 'sanity'
import { apiVersion } from '../env'
import { colourFromFilename, normColour } from '@/lib/util/colour'

type ProductDoc = {
  _id: string
  name: string
  colours: { _key: string; name: string; hex: string }[] | null
  lifestyleImageNames: (string | null)[] | null
}

type ColourFix = {
  productId: string
  productName: string
  colourKey: string
  oldName: string
  newName: string
  hex: string
}

export function ColourSyncTool() {
  const client = useClient({ apiVersion })
  const [busy, setBusy] = useState(false)
  const [fixes, setFixes] = useState<ColourFix[] | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [applyResult, setApplyResult] = useState<{ updated: number } | null>(null)
  const [applyError, setApplyError] = useState<string | null>(null)

  const scan = useCallback(async () => {
    setBusy(true)
    setScanError(null)
    setFixes(null)
    setApplyResult(null)
    setApplyError(null)
    try {
      const products = await client.fetch<ProductDoc[]>(
        `*[_type == "product"]{
          _id,
          name,
          colours[]{_key, name, hex},
          "lifestyleImageNames": lifestyleImages[].asset->originalFilename
        }`
      )

      const out: ColourFix[] = []
      for (const p of products) {
        const photoColours = (p.lifestyleImageNames ?? [])
          .filter((f): f is string => Boolean(f))
          .map((f) => colourFromFilename(f, p.name))
          .filter((c) => c.length > 0)

        const used = new Set<string>()
        for (const c of p.colours ?? []) {
          const currentNorm = normColour(c.name)
          const match = photoColours.find((pc) => {
            if (used.has(pc)) return false
            const pcNorm = normColour(pc)
            return pcNorm !== currentNorm && pcNorm.includes(currentNorm)
          })
          if (match) {
            used.add(match)
            out.push({
              productId: p._id,
              productName: p.name,
              colourKey: c._key,
              oldName: c.name,
              newName: match,
              hex: c.hex,
            })
          }
        }
      }

      setFixes(out)
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Could not scan products.')
    } finally {
      setBusy(false)
    }
  }, [client])

  const apply = useCallback(async () => {
    if (!fixes || fixes.length === 0) return
    setBusy(true)
    setApplyError(null)
    setApplyResult(null)
    try {
      const tx = client.transaction()
      for (const f of fixes) {
        tx.patch(f.productId, (p) => p.set({ [`colours[_key=="${f.colourKey}"].name`]: f.newName }))
      }
      await tx.commit()
      setApplyResult({ updated: fixes.length })
      setFixes(null)
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Could not save colour names.')
    } finally {
      setBusy(false)
    }
  }, [fixes, client])

  return (
    <Box padding={4} style={{ maxWidth: 820, margin: '0 auto' }}>
      <Stack space={5}>
        <Stack space={3}>
          <Inline space={2}>
            <DropIcon style={{ fontSize: 28 }} />
            <Heading size={3}>Colour names</Heading>
          </Inline>
          <Text size={1} muted>
            Scans every product&apos;s lifestyle photo filenames (e.g. &quot;Luna-Transparent
            Green.png&quot;) and compares them to the generic colour names in the Colours list
            (e.g. &quot;Green&quot;). Where a photo name is a more specific version of an existing
            colour name, this renames that colour entry to match the photo - e.g. &quot;Green&quot;
            → &quot;Transparent Green&quot;.
          </Text>
        </Stack>

        <Card padding={4} radius={3} border>
          <Flex align="center" gap={3}>
            <Button text={busy ? 'Scanning…' : 'Scan products'} tone="primary" disabled={busy} onClick={scan} />
            {busy && <Spinner muted />}
          </Flex>
        </Card>

        {scanError && (
          <Card padding={4} radius={3} tone="critical" border>
            <Text size={1}>{scanError}</Text>
          </Card>
        )}

        {fixes && (
          <Card padding={4} radius={3} tone={fixes.length ? 'caution' : 'positive'} border>
            <Stack space={4}>
              <Text weight="semibold">
                {fixes.length === 0
                  ? 'No colour names need fixing.'
                  : `${fixes.length} colour name${fixes.length === 1 ? '' : 's'} can be updated`}
              </Text>

              {fixes.length > 0 && (
                <Stack space={2}>
                  {fixes.map((f) => (
                    <Flex key={`${f.productId}-${f.colourKey}`} align="center" gap={3}>
                      <Box
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: f.hex,
                          flexShrink: 0,
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      />
                      <Text size={1} weight="semibold" style={{ minWidth: 90 }}>
                        {f.productName}
                      </Text>
                      <Text size={1} muted>
                        {f.oldName} → {f.newName}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              )}

              {fixes.length > 0 && (
                <Box>
                  <Button
                    text={busy ? 'Saving…' : `Apply ${fixes.length} rename${fixes.length === 1 ? '' : 's'}`}
                    tone="positive"
                    disabled={busy}
                    onClick={apply}
                  />
                </Box>
              )}
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
            <Text size={1}>Renamed {applyResult.updated} colour(s).</Text>
          </Card>
        )}
      </Stack>
    </Box>
  )
}

export default ColourSyncTool
