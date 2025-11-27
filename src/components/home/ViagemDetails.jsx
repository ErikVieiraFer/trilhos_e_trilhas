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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header da viagem */}
        <div className="mb-8">
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-4 ${getDifficultyColor(viagem.dificuldade)}`}
          >
            {viagem.dificuldade}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {viagem.titulo}
          </h2>
          <p className="text-white/60 text-lg">
            {viagem.descricao_curta || `${viagem.destino} - ${viagem.estado}`}
          </p>
        </div>

        {/* Grid de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descrição */}
            <div>
              <p className="text-white/80 text-lg leading-relaxed">
                {viagem.descricao}
              </p>
            </div>

            {/* What's Included */}
            {viagem.inclusos && viagem.inclusos.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-white font-semibold text-lg mb-4">
                  <Check className="text-green-400" size={20} />
                  O que está incluso
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {viagem.inclusos.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70">
                      <Check size={16} className="text-green-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Not Included */}
            {viagem.nao_inclusos && viagem.nao_inclusos.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-white font-semibold text-lg mb-4">
                  <X className="text-red-400" size={20} />
                  O que não está incluso
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {viagem.nao_inclusos.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70">
                      <X size={16} className="text-red-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What to Bring */}
            {viagem.o_que_levar && viagem.o_que_levar.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-white font-semibold text-lg mb-4">
                  <Backpack className="text-cyan-400" size={20} />
                  O que levar
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {viagem.o_que_levar.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70">
                      <Backpack size={16} className="text-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Button */}
            <a
              href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 btn-gradient px-8 py-4 rounded-full text-white font-semibold text-lg"
            >
              <MessageCircle size={24} />
              Reservar pelo WhatsApp
            </a>

            {viagem.galeria && viagem.galeria.length > 0 && (
              <button
                onClick={() => setShowGallery(true)}
                className="ml-4 px-8 py-4 rounded-full border border-white/20 text-white font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors inline-flex"
              >
                <Images size={20} />
                Ver Galeria
              </button>
            )}
          </div>

          {/* Right Column - 1/3 - Card de Preços */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:sticky lg:top-28">
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

              {/* Detalhes */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-cyan-400" />
                  <div>
                    <p className="text-white/50 text-xs">Data</p>
                    <p className="text-white font-medium">{formatDate(viagem.data_viagem)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-cyan-400" />
                  <div>
                    <p className="text-white/50 text-xs">Duração</p>
                    <p className="text-white font-medium">{viagem.duracao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mountain size={20} className="text-cyan-400" />
                  <div>
                    <p className="text-white/50 text-xs">Dificuldade</p>
                    <p className="text-white font-medium">{viagem.dificuldade}</p>
                  </div>
                </div>

                {viagem.local_saida && (
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-pink-400" />
                    <div>
                      <p className="text-white/50 text-xs">Saída</p>
                      <p className="text-white font-medium">{viagem.local_saida}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-pink-400" />
                  <div>
                    <p className="text-white/50 text-xs">Destino</p>
                    <p className="text-white font-medium">{viagem.destino} - {viagem.estado}</p>
                  </div>
                </div>

                {/* Vagas */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Vagas disponíveis</span>
                    <span className="text-white font-semibold">
                      {viagem.vagas_disponiveis} de {viagem.vagas_total}
                    </span>
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

              {/* Navegação entre viagens */}
              {viagens.length > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-white/10">
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
                        className={`h-2 rounded-full transition-all ${
                          index === activeIndex
                            ? 'bg-gradient-to-r from-cyan-500 to-pink-500 w-8'
                            : 'bg-white/30 w-2 hover:bg-white/50'
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
