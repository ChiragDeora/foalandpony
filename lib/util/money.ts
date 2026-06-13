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
