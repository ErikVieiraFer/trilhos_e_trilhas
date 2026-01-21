import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { formatDateShort } from '../../lib/utils'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const HeroCarousel = ({ viagens, onSlideChange }) => {
  if (!viagens || viagens.length === 0) return null

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
        className="h-full w-full"
      >
        {viagens.map((viagem) => (
          <SwiperSlide key={viagem.id} className="relative h-full w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={viagem.imagem_principal}
                alt={viagem.titulo}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-6 animate-fade-in-up">
                  <MapPin size={16} className="text-cyan-400" />
                  <span className="text-sm md:text-base font-medium">{viagem.destino} - {viagem.estado}</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
                  {viagem.titulo}
                </h1>

                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200 line-clamp-3 md:line-clamp-none">
                  {viagem.descricao_curta}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                  <div className="flex items-center gap-2 text-white/80 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <Calendar size={20} className="text-pink-400" />
                    <span>{formatDateShort(viagem.data_viagem)}</span>
                  </div>
                  <a 
                    href="#detalhes"
                    className="btn-gradient px-8 py-3 rounded-full text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    Ver Detalhes
                    <ArrowRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default HeroCarousel