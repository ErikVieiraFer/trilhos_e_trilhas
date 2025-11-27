import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectFade } from 'swiper/modules'
import { ChevronLeft, ChevronRight, ChevronDown, MapPin } from 'lucide-react'
import { getDifficultyColor } from '../../lib/utils'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const HeroCarousel = ({ viagens, onSlideChange, activeIndex }) => {
  const swiperRef = useRef(null)
  const intervalRef = useRef(null)
  const [autoplayActive, setAutoplayActive] = useState(true)

  const scrollToDetails = () => {
    const detailsSection = document.getElementById('viagem-details')
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Para o autoplay permanentemente quando usuário interage
  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setAutoplayActive(false)
  }

  const handleSlideChange = (swiper) => {
    if (onSlideChange) {
      onSlideChange(swiper.realIndex)
    }
  }

  // Autoplay manual com setInterval
  useEffect(() => {
    if (!viagens || viagens.length <= 1 || !autoplayActive) return

    intervalRef.current = setInterval(() => {
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.slideNext()
      }
    }, 3000) // 3 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [viagens, autoplayActive])

  // Sync quando o índice muda externamente (pelos botões na seção de detalhes)
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      const swiper = swiperRef.current.swiper
      if (swiper.realIndex !== activeIndex) {
        stopAutoplay() // Para o autoplay quando muda pela seção de detalhes
        swiper.slideToLoop(activeIndex, 800)
      }
    }
  }, [activeIndex])

  // Para o autoplay quando scrollar para fora da seção do carousel
  useEffect(() => {
    const handleScroll = () => {
      if (!autoplayActive) return

      const heroSection = document.getElementById('viagens')
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect()
        // Se a seção do hero saiu da tela (scrollou pra baixo)
        if (rect.bottom < window.innerHeight * 0.5) {
          stopAutoplay()
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [autoplayActive])

  if (!viagens || viagens.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Trilhos & Trilhas
          </h1>
          <p className="text-xl text-white/60">
            Sua próxima aventura está sendo preparada...
          </p>
        </div>
      </div>
    )
  }

  return (
    <section id="viagens" className="relative h-screen pt-20">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, EffectFade]}
        effect="fade"
        speed={800}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next'
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        loop={viagens.length > 1}
        onSlideChange={handleSlideChange}
        onTouchStart={stopAutoplay}
        onNavigationNext={stopAutoplay}
        onNavigationPrev={stopAutoplay}
        className="h-full"
      >
        {viagens.map((viagem, index) => (
          <SwiperSlide key={viagem.id || index}>
            <div className="relative h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${viagem.imagem_principal || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920'})`
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/50 to-blue-950/20" />
              </div>

              {/* Content - Centralizado */}
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="text-center animate-fadeInUp px-8 sm:px-16 lg:px-24">
                  {/* Difficulty Badge */}
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-white mb-4 ${getDifficultyColor(viagem.dificuldade)}`}
                  >
                    {viagem.dificuldade}
                  </span>

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    {viagem.titulo}
                  </h1>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-2 text-white/90 text-lg md:text-xl">
                    <MapPin size={22} className="text-cyan-400" />
                    <span>{viagem.destino}</span>
                    <span className="text-pink-400">•</span>
                    <span>{viagem.estado}</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {viagens.length > 1 && (
        <>
          <button
            className="hero-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-cyan-500/50 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            className="hero-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-cyan-500/50 transition-all"
            aria-label="Próximo"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Scroll Indicator */}
      <button
        onClick={scrollToDetails}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/60 hover:text-white transition-colors"
        aria-label="Ver detalhes"
      >
        <ChevronDown size={32} className="animate-bounce-slow" />
      </button>
    </section>
  )
}

export default HeroCarousel
