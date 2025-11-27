import { Instagram, ArrowRight } from 'lucide-react'

const SobreSection = ({ config }) => {
  const instagramUrl = config?.instagram || import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/trilhosetrilhases'

  const stats = [
    { number: `+${config?.num_aventureiros || '500'}`, label: 'Aventureiros' },
    { number: `+${config?.num_trilhas || '50'}`, label: 'Trilhas realizadas' },
    { number: config?.num_estados || '4', label: 'Estados' }
  ]

  const images = [
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600',
    'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600'
  ]

  return (
    <section id="sobre" className="section-spacing bg-blue-950">
      <div className="container-centered">

        {/* Header - Centralizado */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 font-semibold mb-4">Sobre Nós</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Sua próxima aventura{' '}
            <span className="gradient-text">começa aqui</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {config?.sobre_texto || 'Somos uma empresa de turismo de aventura do Espírito Santo, especializada em trilhas, viagens a praias, campings e expedições noturnas.'}
          </p>
        </div>

        {/* Stats - Centralizado */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold gradient-text">
                {stat.number}
              </p>
              <p className="text-white/50 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Images Grid - Centralizado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <img
                src={image}
                alt={`Aventura ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Instagram Link - Centralizado */}
        <div className="text-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <span className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
              <Instagram size={28} className="text-white" />
            </span>
            <span className="text-white font-medium text-lg group-hover:text-cyan-400 transition-colors">
              Siga-nos no Instagram
            </span>
            <ArrowRight size={22} className="text-white/60 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default SobreSection
