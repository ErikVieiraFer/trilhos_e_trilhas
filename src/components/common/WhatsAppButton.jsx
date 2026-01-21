import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'

  return (
    <a
      href={getWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white rounded-full shadow-lg hover:shadow-green-500/50 transition-all duration-300"
      aria-label="Contato via WhatsApp"
    >
      <div className="flex items-center">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isHovered ? 'max-w-40 pl-4' : 'max-w-0'
          }`}
        >
          <span className="whitespace-nowrap font-medium">Fale Conosco</span>
        </div>
        <div className="p-4">
          <MessageCircle size={28} fill="white" />
        </div>
      </div>
    </a>
  )
}

export default WhatsAppButton
