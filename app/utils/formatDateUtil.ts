export const myFormatDate = (date: Date) =>
  new Intl.DateTimeFormat('es-CR').format(new Date(date))