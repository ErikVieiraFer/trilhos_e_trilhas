import { MessageCircle, ArrowRight } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const FooterCTA = ({ config }) => {
  const whatsappNumber = config?.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const backgroundImage = config?.footer_imagem || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920'

  return (
    <section id="contato" className="relative section-cta">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-blue-950/85" />
      </div>

      {/* Content - Centralizado */}
      <div className="relative container-centered text-center">
        {/* Main Title - MUITO MAIOR */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
          Pronto para sua próxima{' '}
          <span className="gradient-text block mt-2">aventura?</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed text-centered">
          Entre em contato conosco e reserve seu lugar na próxima expedição.
          Estamos prontos para te levar em uma jornada inesquecível!
        </p>

        {/* WhatsApp Button - MAIOR */}
        <a
          href={getWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 btn-gradient px-12 py-6 rounded-full text-white font-bold text-xl shadow-2xl hover:shadow-cyan-500/30 transition-all"
        >
          <MessageCircle size={32} />
          Falar no WhatsApp
          <ArrowRight size={28} />
        </a>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-white/60 text-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Resposta rápida</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>Pagamento facilitado</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
            <span>Grupos pequenos</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FooterCTA
