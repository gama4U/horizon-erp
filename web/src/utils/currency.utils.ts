export const formatCurrency = (currency: string, value: number) => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  });
  return currencyFormatter.format(value);
}