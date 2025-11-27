import { useState } from 'react'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Mountain,
  Check,
  X,
  Backpack,
  MessageCircle,
  Images,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatCurrency, formatDate, getDifficultyColor, getWhatsAppLink } from '../../lib/utils'

const ViagemDetails = ({ viagens, activeIndex, onIndexChange }) => {
  const [showGallery, setShowGallery] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  const viagem = viagens?.[activeIndex]

  if (!viagem) {
    return null
  }

  const whatsappMessage = `Olá! Tenho interesse na viagem: ${viagem.titulo} - ${formatDate(viagem.data_viagem)}. Gostaria de mais informações!`
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'

  const vagasPercentage = (viagem.vagas_disponiveis / viagem.vagas_total) * 100

  const handlePrevViagem = () => {
    const newIndex = activeIndex === 0 ? viagens.length - 1 : activeIndex - 1
    onIndexChange(newIndex)
  }

  const handleNextViagem = () => {
    const newIndex = activeIndex === viagens.length - 1 ? 0 : activeIndex + 1
    onIndexChange(newIndex)
  }

  return (
    <section id="viagem-details" className="py-16 md:py-24 bg-gradient-to-b from-blue-950 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Title & Badge */}
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-3 ${getDifficultyColor(viagem.dificuldade)}`}
              >
                {viagem.dificuldade}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {viagem.titulo}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                {viagem.descricao}
              </p>
            </div>

            {/* What's Included */}
            {viagem.inclusos && viagem.inclusos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Check className="text-green-400" size={24} />
                  O que está incluso
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {viagem.inclusos.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                      <Check size={18} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Not Included */}
            {viagem.nao_inclusos && viagem.nao_inclusos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <X className="text-red-400" size={24} />
                  O que não está incluso
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {viagem.nao_inclusos.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                      <X size={18} className="text-red-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Bring */}
            {viagem.o_que_levar && viagem.o_que_levar.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Backpack className="text-cyan-400" size={24} />
                  O que levar
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {viagem.o_que_levar.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                      <Backpack size={18} className="text-cyan-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient px-8 py-4 rounded-full text-white font-semibold flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Reservar pelo WhatsApp
              </a>
              {viagem.galeria && viagem.galeria.length > 0 && (
                <button
                  onClick={() => setShowGallery(true)}
                  className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <Images size={20} />
                  Ver Galeria
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Info Card */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 md:p-8 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6 pb-6 border-b border-white/10">
                <p className="text-white/60 text-sm mb-1">A partir de</p>
                <p className="text-4xl font-bold gradient-text">
                  {formatCurrency(viagem.preco)}
                </p>
                {viagem.preco_parcelado && (
                  <p className="text-white/60 text-sm mt-1">
                    {viagem.preco_parcelado}
                  </p>
                )}
              </div>

              {/* Info Items */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Calendar size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Data</p>
                    <p className="text-white font-medium">{formatDate(viagem.data_viagem)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Clock size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Duração</p>
                    <p className="text-white font-medium">{viagem.duracao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Mountain size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Dificuldade</p>
                    <p className="text-white font-medium">{viagem.dificuldade}</p>
                  </div>
                </div>

                {viagem.local_saida && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <MapPin size={20} className="text-pink-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Saída</p>
                      <p className="text-white font-medium">{viagem.local_saida}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <MapPin size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Destino</p>
                    <p className="text-white font-medium">{viagem.destino} - {viagem.estado}</p>
                  </div>
                </div>

                {/* Vagas */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Users size={20} className="text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">Vagas disponíveis</p>
                      <p className="text-white font-medium">
                        {viagem.vagas_disponiveis} de {viagem.vagas_total}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${vagasPercentage}%` }}
                    />
                  </div>
                  {viagem.vagas_disponiveis <= 5 && viagem.vagas_disponiveis > 0 && (
                    <p className="text-pink-400 text-sm mt-2 font-medium">
                      Últimas vagas!
                    </p>
                  )}
                  {viagem.vagas_disponiveis === 0 && (
                    <p className="text-red-400 text-sm mt-2 font-medium">
                      Esgotado
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile CTA */}
              <a
                href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient w-full mt-6 px-6 py-4 rounded-full text-white font-semibold flex items-center justify-center gap-2 lg:hidden"
              >
                <MessageCircle size={20} />
                Reservar Agora
              </a>
            </div>

            {/* Pagination Dots */}
            {viagens.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={handlePrevViagem}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/50 transition-colors"
                  aria-label="Viagem anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {viagens.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => onIndexChange(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === activeIndex
                          ? 'bg-gradient-to-r from-cyan-500 to-pink-500 w-8'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Viagem ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNextViagem}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/50 transition-colors"
                  aria-label="Próxima viagem"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Lightbox */}
      {showGallery && viagem.galeria && viagem.galeria.length > 0 && (
        <div
          className="lightbox-overlay"
          onClick={() => setShowGallery(false)}
        >
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
            aria-label="Fechar galeria"
          >
            <X size={32} />
          </button>
          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viagem.galeria[galleryIndex]}
              alt={`${viagem.titulo} - Foto ${galleryIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            {viagem.galeria.length > 1 && (
              <>
                <button
                  onClick={() => setGalleryIndex(galleryIndex === 0 ? viagem.galeria.length - 1 : galleryIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-cyan-500/50"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => setGalleryIndex(galleryIndex === viagem.galeria.length - 1 ? 0 : galleryIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-cyan-500/50"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
            <p className="text-white/60 text-center mt-4">
              {galleryIndex + 1} / {viagem.galeria.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ViagemDetails
