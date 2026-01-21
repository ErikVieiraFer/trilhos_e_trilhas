import { Users, Map, Flag } from 'lucide-react'

const SobreSection = ({ config }) => {
  const stats = [
    { label: 'Aventureiros', value: config?.num_aventureiros || '500+', icon: Users, color: 'text-cyan-400' },
    { label: 'Trilhas', value: config?.num_trilhas || '50+', icon: Map, color: 'text-pink-400' },
    { label: 'Estados', value: config?.num_estados || '4', icon: Flag, color: 'text-yellow-400' },
  ]

  return (
    <section id="sobre" className="py-20 bg-blue-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sobre a <span className="gradient-text">Trilhos & Trilhas</span>
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {config?.sobre_texto || 'Somos uma empresa apaixonada por natureza e aventura. Nossa missão é proporcionar experiências únicas e seguras, conectando pessoas a lugares incríveis.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="glass p-4 rounded-2xl text-center">
                    <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                    <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-white/60 text-xs md:text-sm uppercase tracking-wider">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Image Grid - 1 column on mobile, 2 on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-48 md:h-64 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800" alt="Trilha" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="h-32 md:h-48 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800" alt="Camping" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
              </div>
            </div>
            <div className="space-y-4 md:mt-8">
              <div className="h-32 md:h-48 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800" alt="Natureza" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="h-48 md:h-64 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800" alt="Aventura" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SobreSection