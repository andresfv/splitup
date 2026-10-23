export const myFormatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC'
  }).format(value)
}