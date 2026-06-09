export function formatInr(amount: number, currencyCode = 'inr') {
  if (currencyCode.toLowerCase() !== 'inr') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Medusa amounts are often in major units; adjust if your API returns minor units. */
export function formatVariantPrice(
  amount: number | undefined | null,
  currencyCode = 'inr'
) {
  if (amount == null) return '—'
  return formatInr(amount, currencyCode)
}
