import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, ChevronDown, MapPin } from 'lucide-react'
import { getDifficultyColor } from '../../lib/utils'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const HeroCarousel = ({ viagens, onSlideChange, activeIndex }) => {
  const swiperRef = useRef(null)

  const scrollToDetails = () => {
    const detailsSection = document.getElementById('viagem-details')
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSlideChange = (swiper) => {
    if (onSlideChange) {
      onSlideChange(swiper.realIndex)
    }
  }

  // Sync external navigation
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(activeIndex)
    }
  }, [activeIndex])

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
    <section id="viagens" className="relative h-screen">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
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
        autoplay={{
          delay: 6000,
          disableOnInteraction: true
        }}
        loop={viagens.length > 1}
        onSlideChange={handleSlideChange}
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
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end pb-32 md:pb-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl animate-fadeInUp">
                    {/* Difficulty Badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4 ${getDifficultyColor(viagem.dificuldade)}`}
                    >
                      {viagem.dificuldade}
                    </span>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                      {viagem.titulo}
                    </h1>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-white/80 text-lg md:text-xl">
                      <MapPin size={20} className="text-cyan-400" />
                      <span>{viagem.destino}</span>
                      <span className="text-pink-400">•</span>
                      <span>{viagem.estado}</span>
                    </div>

                    {/* Short Description */}
                    {viagem.descricao_curta && (
                      <p className="mt-4 text-white/70 text-lg max-w-lg hidden md:block">
                        {viagem.descricao_curta}
                      </p>
                    )}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        aria-label="Ver detalhes"
      >
        <span className="text-sm font-medium hidden md:block">Ver Detalhes</span>
        <ChevronDown size={28} className="animate-bounce-slow" />
      </button>
    </section>
  )
}

export default HeroCarousel
