import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { SectionLoader } from '../common/LoadingSpinner'

const GaleriaMomentos = ({ fotos, loading }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedFotos, setDisplayedFotos] = useState([])

  // Função para pegar 6 fotos aleatórias
  const getRandomPhotos = (photos, count = 6) => {
    if (!photos || photos.length === 0) return []
    const shuffled = [...photos].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, photos.length))
  }

  // Inicializar com fotos aleatórias
  useEffect(() => {
    if (fotos && fotos.length > 0) {
      setDisplayedFotos(getRandomPhotos(fotos))
    }
  }, [fotos])

  // Trocar fotos a cada 8 segundos
  useEffect(() => {
    if (!fotos || fotos.length === 0) return

    const interval = setInterval(() => {
      setDisplayedFotos(getRandomPhotos(fotos))
    }, 8000) // 8 segundos

    return () => clearInterval(interval)
  }, [fotos])

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'auto'
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayedFotos.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayedFotos.length - 1 ? 0 : currentIndex + 1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  if (loading) {
    return <SectionLoader />
  }

  if (!fotos || fotos.length === 0) {
    return null
  }

  return (
    <section id="galeria" className="section-spacing bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="container-centered">
        {/* Header - TUDO BEM CENTRALIZADO */}
        <div style={{ width: '100%', maxWidth: '80rem', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
          <p className="text-cyan-400 font-semibold mb-6 text-lg">Galeria</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Momentos <span className="gradient-text">Inesquecíveis</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed" style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            Confira algumas fotos das nossas aventuras e dos nossos aventureiros
          </p>
        </div>

        {/* Grid de fotos - centralizado - 6 fotos fixas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayedFotos.map((foto, index) => (
            <div
              key={`${foto.id}-${index}`}
              onClick={() => openLightbox(index)}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ aspectRatio: '1' }}
            >
              <img
                src={foto.imagem_url}
                alt={foto.legenda || 'Momento Trilhos e Trilhas'}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700 animate-fade-in"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Expand size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {foto.legenda && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{foto.legenda}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white z-10 p-2"
            aria-label="Fechar"
          >
            <X size={32} />
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-6xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayedFotos[currentIndex].imagem_url}
              alt={displayedFotos[currentIndex].legenda || `Foto ${currentIndex + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />

            {/* Navigation */}
            {displayedFotos.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-cyan-500/50 transition-colors"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-cyan-500/50 transition-colors"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Caption & Counter */}
            <div className="text-center mt-4">
              {displayedFotos[currentIndex].legenda && (
                <p className="text-white mb-2">{displayedFotos[currentIndex].legenda}</p>
              )}
              <p className="text-white/60 text-sm">
                {currentIndex + 1} / {displayedFotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default GaleriaMomentos
