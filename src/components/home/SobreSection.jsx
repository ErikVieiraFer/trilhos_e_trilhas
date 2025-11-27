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
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600'
  ]

  return (
    <section id="sobre" className="py-16 md:py-24 bg-blue-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <p className="text-cyan-400 font-semibold">Sobre Nós</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Sua próxima aventura{' '}
              <span className="gradient-text">começa aqui</span>
            </h2>

            <div className="space-y-4 text-white/70">
              <p>
                {config?.sobre_texto || 'Somos uma empresa de turismo de aventura do Espírito Santo, especializada em trilhas, viagens a praias, campings e expedições noturnas.'}
              </p>
              <p>
                Atuamos nos estados ES, RJ, MG e BA, levando nossos aventureiros para experiências únicas em meio à natureza.
              </p>
              <p>
                Nossa missão é proporcionar momentos inesquecíveis, sempre com segurança e respeito ao meio ambiente.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold gradient-text">
                    {stat.number}
                  </p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Instagram Link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <span className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram size={24} className="text-white" />
              </span>
              <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                Siga-nos no Instagram
              </span>
              <ArrowRight size={20} className="text-white/60 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right Column - Images (8 columns) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-4">
              {/* Large image on the left */}
              <div className="row-span-2">
                <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden group">
                  <img
                    src={images[0]}
                    alt="Aventura nas trilhas"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Smaller images on the right */}
              <div className="relative h-60 rounded-2xl overflow-hidden group">
                <img
                  src={images[1]}
                  alt="Trilha na montanha"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="relative h-60 rounded-2xl overflow-hidden group">
                <img
                  src={images[2]}
                  alt="Camping na natureza"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SobreSection
