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
    <section id="sobre" className="py-16 md:py-24 bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-cyan-400 font-semibold mb-2">Sobre Nós</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Sua próxima aventura{' '}
                <span className="gradient-text">começa aqui</span>
              </h2>
            </div>

            <div className="space-y-4 text-white/70 text-lg">
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
            <div className="grid grid-cols-3 gap-6 py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold gradient-text">
                    {stat.number}
                  </p>
                  <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Instagram Link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white font-semibold group"
            >
              <span className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Instagram size={24} />
              </span>
              <span className="group-hover:text-cyan-400 transition-colors">
                Siga-nos no Instagram
              </span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right Column - Image Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-4">
              {/* Large image */}
              <div className="col-span-2 md:col-span-1 md:row-span-2">
                <div className="relative group overflow-hidden rounded-2xl h-64 md:h-full">
                  <img
                    src={images[0]}
                    alt="Aventura nas trilhas"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Small images */}
              <div className="relative group overflow-hidden rounded-2xl h-48 md:h-auto">
                <img
                  src={images[1]}
                  alt="Trilha na montanha"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="relative group overflow-hidden rounded-2xl h-48 md:h-auto">
                <img
                  src={images[2]}
                  alt="Camping na natureza"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Wide bottom image */}
              <div className="col-span-2 relative group overflow-hidden rounded-2xl h-48">
                <img
                  src={images[3]}
                  alt="Expedição noturna"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
