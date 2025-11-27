import { MessageCircle, ArrowRight } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const FooterCTA = ({ config }) => {
  const whatsappNumber = config?.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const backgroundImage = config?.footer_imagem || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920'

  return (
    <section id="contato" className="relative py-24 md:py-32">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/80" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Pronto para sua próxima{' '}
          <span className="gradient-text">aventura?</span>
        </h2>

        <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
          Entre em contato conosco e reserve seu lugar na próxima expedição.
          Estamos prontos para te levar em uma jornada inesquecível!
        </p>

        {/* WhatsApp Button */}
        <a
          href={getWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 btn-gradient px-10 py-5 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/30"
        >
          <MessageCircle size={28} />
          Falar no WhatsApp
          <ArrowRight size={24} />
        </a>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
          <div className="flex items-center gap-2 text-white/70">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Resposta rápida</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Pagamento facilitado</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Grupos pequenos</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FooterCTA
