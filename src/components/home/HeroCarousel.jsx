import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const HeroCarousel = () => {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDestaques()
  }, [])

  const fetchDestaques = async () => {
    try {
      // 1. Tenta buscar viagens marcadas como DESTAQUE e ATIVAS
      let { data, error } = await supabase
        .from('viagens')
        .select('*')
        .eq('destaque', true)
        .eq('ativo', true)
        .limit(5)

      // 2. Se não encontrar destaques, busca QUAISQUER viagens ativas (fallback)
      if (!data || data.length === 0) {
        const { data: activeTrips } = await supabase
          .from('viagens')
          .select('*')
          .eq('ativo', true)
          .limit(5)
        
        if (activeTrips && activeTrips.length > 0) {
          data = activeTrips
        }
      }

      if (data && data.length > 0) {
        setSlides(data)
      } else {
        // Fallback slides if no featured trips
        setSlides([
          {
            id: 'fallback-1',
            titulo: 'Aventure-se pelo Brasil',
            descricao_curta: 'Descubra lugares incríveis com a Trilhos & Trilhas',
            imagem_principal: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000',
            destino: 'Brasil',
            slug: 'viagens'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (loading) return <div className="h-screen bg-blue-950 animate-pulse" />

  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-screen w-full overflow-hidden bg-blue-950">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Image with Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.imagem_principal}
            alt={slide.titulo}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto mt-16 flex flex-col items-center text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm md:text-base font-medium mb-4 animate-fade-in-up">
                {slide.destino}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100 drop-shadow-2xl">
                {slide.titulo}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200 line-clamp-2 md:line-clamp-none drop-shadow-md">
                {slide.descricao_curta}
              </p>
              
              {slide.id !== 'fallback-1' && (
                <Link
                  to={`/viagens/${slide.slug}`}
                  className="btn-gradient px-8 py-4 rounded-full text-white font-bold text-lg inline-flex items-center gap-2 hover:scale-105 transition-transform animate-fade-in-up delay-300 shadow-lg shadow-cyan-500/20"
                >
                  Ver Detalhes
                  <ChevronRight size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:block"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Gradient Transition (Suavização para a próxima seção) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-950 to-transparent z-20 pointer-events-none" />
    </div>
  )
}

export default HeroCarousel