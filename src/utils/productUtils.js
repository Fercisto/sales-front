export const getInitials = (nombre) => {
  if (!nombre || typeof nombre !== 'string') return '??'

  return nombre
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const getColorFromName = (nombre) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-red-500 to-red-600',
  ]

  if (!nombre || typeof nombre !== 'string') return colors[0]

  const index = nombre.length % colors.length
  return colors[index]
}

export const formatPrice = (precio) => {
  if (precio === undefined || precio === null || isNaN(precio)) return '$0.00'

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(precio)
}