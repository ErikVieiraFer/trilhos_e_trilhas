import { Instagram, ArrowRight, Shield, Award, Users, Heart } from 'lucide-react'

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

  const trustBadges = [
    {
      icon: Shield,
      title: 'Segurança Garantida',
      description: 'Guias certificados e equipamentos homologados',
      color: 'cyan'
    },
    {
      icon: Award,
      title: '+5 Anos de Experiência',
      description: 'Milhares de aventureiros satisfeitos',
      color: 'pink'
    },
    {
      icon: Users,
      title: 'Grupos Pequenos',
      description: 'Experiência personalizada e intimista',
      color: 'green'
    },
    {
      icon: Heart,
      title: 'Paixão pela Natureza',
      description: 'Turismo sustentável e consciente',
      color: 'purple'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      cyan: 'bg-cyan-500/20 text-cyan-400',
      pink: 'bg-pink-500/20 text-pink-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400'
    }
    return colors[color] || colors.cyan
  }

  return (
    <section id="sobre" className="section-spacing bg-blue-900">
      <div className="container-centered">

        {/* Header - TUDO BEM CENTRALIZADO */}
        <div style={{ width: '100%', maxWidth: '80rem', margin: '0 auto', textAlign: 'center', marginBottom: '5rem' }}>
          <p className="text-cyan-400 font-semibold mb-6 text-lg">Sobre Nós</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
            Sua próxima aventura{' '}
            <span className="gradient-text">começa aqui</span>
          </h2>
          <p className="text-xl text-white/70 leading-relaxed" style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginBottom: '4rem' }}>
            {config?.sobre_texto || 'Somos uma empresa de turismo de aventura do Espírito Santo, especializada em trilhas, viagens a praias, campings e expedições noturnas.'}
          </p>
        </div>

        {/* Estatísticas - MAIS ESPAÇO */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20" style={{ marginBottom: '5rem' }}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-5xl md:text-6xl font-bold gradient-text mb-2">
                {stat.number}
              </p>
              <p className="text-white/60 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Badges de Confiança - MAIS ESPAÇO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '5rem' }}>
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="glass p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 rounded-full ${getColorClasses(badge.color)} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={32} />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">{badge.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{badge.description}</p>
              </div>
            )
          })}
        </div>

        {/* Grid de fotos assimétrico */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-16">

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

        {/* Link do Instagram - SEPARADOR ENTRE SEÇÕES */}
        <div style={{ textAlign: 'center', marginTop: '6rem', marginBottom: '-2rem' }}>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold transition-all"
            style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1.25rem',
              boxShadow: '0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)'
              e.currentTarget.style.boxShadow = '0 0 50px rgba(236, 72, 153, 0.8), 0 0 80px rgba(168, 85, 247, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)'
            }}
          >
            <Instagram size={28} />
            Siga-nos no Instagram
            <ArrowRight size={24} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default SobreSection
