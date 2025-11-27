import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { SectionLoader } from '../common/LoadingSpinner'

const GaleriaMomentos = ({ fotos, loading }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

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
    setCurrentIndex(currentIndex === 0 ? fotos.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === fotos.length - 1 ? 0 : currentIndex + 1)
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

  // Create masonry-like layout
  const getGridClass = (index) => {
    const pattern = index % 6
    switch (pattern) {
      case 0:
        return 'col-span-2 row-span-2'
      case 1:
      case 2:
        return 'col-span-1 row-span-1'
      case 3:
        return 'col-span-1 row-span-2'
      case 4:
      case 5:
        return 'col-span-1 row-span-1'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  return (
    <section id="galeria" className="py-16 md:py-24 bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-cyan-400 font-semibold mb-2">Galeria</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Momentos <span className="gradient-text">Inesquecíveis</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Confira algumas fotos das nossas aventuras e dos nossos aventureiros
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {fotos.map((foto, index) => (
            <div
              key={foto.id}
              className={`${getGridClass(index)} relative group overflow-hidden rounded-xl cursor-pointer`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={foto.imagem_url}
                alt={foto.legenda || `Momento ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Expand size={24} className="text-white" />
                  </div>
                </div>
                {foto.legenda && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm">{foto.legenda}</p>
                  </div>
                )}
              </div>
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
              src={fotos[currentIndex].imagem_url}
              alt={fotos[currentIndex].legenda || `Foto ${currentIndex + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />

            {/* Navigation */}
            {fotos.length > 1 && (
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
              {fotos[currentIndex].legenda && (
                <p className="text-white mb-2">{fotos[currentIndex].legenda}</p>
              )}
              <p className="text-white/60 text-sm">
                {currentIndex + 1} / {fotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default GaleriaMomentos
