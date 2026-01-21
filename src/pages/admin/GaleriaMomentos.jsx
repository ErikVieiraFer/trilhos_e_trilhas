import { Image as ImageIcon } from 'lucide-react'

const GaleriaMomentos = ({ fotos, loading }) => {
  if (loading) return null
  if (!fotos || fotos.length === 0) return null

  return (
    <section id="galeria" className="py-20 bg-blue-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/20 mb-6">
            <ImageIcon className="text-pink-400" size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Momentos <span className="gradient-text">Inesquecíveis</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Registros das nossas aventuras e da alegria de quem viaja com a gente
          </p>
        </div>

        {/* Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto) => (
            <div key={foto.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
              <img 
                src={foto.imagem_url} 
                alt={foto.legenda || 'Momento Trilhos & Trilhas'} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-medium text-sm md:text-base">{foto.legenda}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GaleriaMomentos