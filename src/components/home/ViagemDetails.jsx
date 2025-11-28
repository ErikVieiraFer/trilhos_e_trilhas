import { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  Mountain,
  Check,
  X,
  Backpack,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Expand,
  ExternalLink
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
    <section id="viagem-details" className="section-spacing bg-gradient-to-b from-blue-950 to-blue-900">
      <div className="container-centered">

        {/* Header da viagem - Centralizado */}
        <div className="text-center mb-12">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-4 ${getDifficultyColor(viagem.dificuldade)}`}>
            {viagem.dificuldade}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {viagem.titulo}
          </h2>
          {viagem.descricao_curta && (
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {viagem.descricao_curta}
            </p>
          )}
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Coluna Esquerda - 3/5 */}
          <div className="lg:col-span-3 space-y-8">

            {/* Descrição completa */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <p className="text-white/80 text-lg leading-relaxed">
                {viagem.descricao}
              </p>
            </div>

            {/* O que está incluso */}
            {viagem.inclusos && viagem.inclusos.length > 0 && (
              <div className="glass rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="text-green-400" size={20} />
                  </div>
                  O que está incluso
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {viagem.inclusos.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80">
                      <Check size={18} className="text-green-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* O que NÃO está incluso */}
            {viagem.nao_inclusos && viagem.nao_inclusos.length > 0 && (
              <div className="glass rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="text-red-400" size={20} />
                  </div>
                  O que não está incluso
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {viagem.nao_inclusos.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80">
                      <X size={18} className="text-red-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* O que levar */}
            {viagem.o_que_levar && viagem.o_que_levar.length > 0 && (
              <div className="glass rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Backpack className="text-cyan-400" size={20} />
                  </div>
                  O que levar
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {viagem.o_que_levar.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80">
                      <Backpack size={18} className="text-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex flex-wrap gap-4">
              <a
                href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient px-8 py-4 rounded-full text-white font-semibold flex items-center gap-3 text-lg"
              >
                <MessageCircle size={24} />
                Reservar pelo WhatsApp
              </a>
              {viagem.galeria && viagem.galeria.length > 0 && (
                <button
                  onClick={() => setShowGallery(true)}
                  className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-semibold flex items-center gap-3 text-lg hover:bg-white/10 transition-colors"
                >
                  <ExternalLink size={24} />
                  Ver Galeria
                </button>
              )}
            </div>
          </div>

          {/* Coluna Direita - 2/5 - Card de Preços */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 md:p-8 lg:sticky lg:top-28">
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
            </div>
          </div>
        </div>

        {/* Mini Galeria da Viagem */}
        {viagem.galeria && viagem.galeria.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Fotos desta aventura
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {viagem.galeria.slice(0, 4).map((foto, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setGalleryIndex(index)
                    setShowGallery(true)
                  }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={foto}
                    alt={`${viagem.titulo} - Foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Expand size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navegação entre viagens */}
        {viagens.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={handlePrevViagem}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/50 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {viagens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onIndexChange(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-gradient-to-r from-cyan-500 to-pink-500 w-10'
                      : 'bg-white/30 w-3 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextViagem}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/50 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
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
