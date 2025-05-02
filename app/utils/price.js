/**
 * price(value)      -> "$12.34"
 * price(99, 'EUR')  -> "€99.00"
 * price(1400, 'INR','hi-IN') -> "₹1,400.00"
 */

const formatterCache = new Map();

export function price(
  amount,
  currency = 'USD',
  locale = 'en-US',
  options = {},
) {
  const cacheKey = `${locale}_${currency}_${JSON.stringify(options)}`;
  let formatter = formatterCache.get(cacheKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options,
    });
    formatterCache.set(cacheKey, formatter);
  }

  return formatter.format(amount);
}
