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
    <section id="sobre" className="section-spacing bg-blue-900">
      <div className="container-centered">

        {/* Header centralizado */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 font-semibold mb-4 text-lg">Sobre Nós</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Sua próxima aventura{' '}
            <span className="gradient-text">começa aqui</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {config?.sobre_texto || 'Somos uma empresa de turismo de aventura do Espírito Santo, especializada em trilhas, viagens a praias, campings e expedições noturnas.'}
          </p>
        </div>

        {/* Estatísticas */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-5xl md:text-6xl font-bold gradient-text mb-2">
                {stat.number}
              </p>
              <p className="text-white/60 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Grid de fotos assimétrico */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-12">

          {/* Foto grande à esquerda - ocupa mais espaço */}
          <div className="md:col-span-7 relative group overflow-hidden rounded-2xl">
            <div className="aspect-[4/5] md:aspect-[3/4]">
              <img
                src={images[0]}
                alt="Aventura nas trilhas"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Coluna direita com 2 fotos empilhadas */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">

            {/* Foto superior direita */}
            <div className="relative group overflow-hidden rounded-2xl flex-1">
              <div className="aspect-[4/3] h-full">
                <img
                  src={images[1]}
                  alt="Trilha na montanha"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Foto inferior direita */}
            <div className="relative group overflow-hidden rounded-2xl flex-1">
              <div className="aspect-[4/3] h-full">
                <img
                  src={images[2]}
                  alt="Camping na natureza"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Link do Instagram - centralizado */}
        <div className="flex justify-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all group"
          >
            <Instagram size={28} />
            <span>Siga-nos no Instagram</span>
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default SobreSection
