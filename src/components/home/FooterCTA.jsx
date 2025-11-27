import { MessageCircle, ArrowRight } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const FooterCTA = ({ config }) => {
  const whatsappNumber = config?.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const backgroundImage = config?.footer_imagem || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920'

  return (
    <section className="relative py-24 md:py-32">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Pronto para sua próxima{' '}
          <span className="gradient-text">aventura?</span>
        </h2>

        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
          Entre em contato conosco e reserve seu lugar na próxima expedição.
          Estamos prontos para te levar em uma jornada inesquecível!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={getWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient px-8 py-4 rounded-full text-white font-semibold flex items-center gap-3 text-lg"
          >
            <MessageCircle size={24} />
            Falar no WhatsApp
            <ArrowRight size={20} />
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Resposta rápida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Pagamento facilitado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500" />
            <span>Grupos pequenos</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FooterCTA
