export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))
}

export const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const getWhatsAppLink = (number, message = '') => {
  const baseUrl = 'https://wa.me/'
  const cleanNumber = number?.replace(/\D/g, '') || import.meta.env.VITE_WHATSAPP_NUMBER
  const encodedMessage = encodeURIComponent(message)
  return `${baseUrl}${cleanNumber}${message ? `?text=${encodedMessage}` : ''}`
}

export const getDifficultyColor = (difficulty) => {
  const colors = {
    'Fácil': 'bg-green-500',
    'Moderada': 'bg-yellow-500',
    'Difícil': 'bg-orange-500',
    'Extrema': 'bg-red-500'
  }
  return colors[difficulty] || 'bg-gray-500'
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 11
}
