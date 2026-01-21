import { MessageCircle } from 'lucide-react'

const FooterCTA = ({ config }) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={config?.footer_imagem || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920'}
          alt="Background"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Pronto para sua próxima <br />
          <span className="gradient-text">aventura?</span>
        </h2>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Entre em contato conosco agora mesmo e garanta seu lugar nas melhores experiências de ecoturismo.
        </p>
        <a
          href={`https://wa.me/${config?.whatsapp || '5527999999999'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 btn-gradient px-8 py-4 rounded-full text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
        >
          <MessageCircle size={24} />
          Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}

export default FooterCTA