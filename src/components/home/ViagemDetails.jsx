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
  ExternalLink,
} from 'lucide-react'
import { formatCurrency, formatDate, getDifficultyColor, getWhatsAppLink } from '../../lib/utils'
import InfoCard from './InfoCard'

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
    <section id="viagem-details" className="relative section-spacing bg-gradient-to-b from-blue-950 to-blue-900 pt-32 overflow-hidden">
      <div className="container-centered">

        {/* Header da viagem - TUDO CENTRALIZADO */}
        <div style={{ textAlign: 'center', maxWidth: '56rem', margin: '0 auto', marginBottom: '5rem' }}>
          <span className={`inline-block px-5 py-2 rounded-full text-sm font-semibold text-white mb-6 ${getDifficultyColor(viagem.dificuldade)}`}>
            {viagem.dificuldade}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {viagem.titulo}
          </h2>
          {viagem.descricao_curta && (
            <p className="text-xl text-white/70 leading-relaxed" style={{ maxWidth: '48rem', margin: '0 auto' }}>
              {viagem.descricao_curta}
            </p>
          )}
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">

          {/* Coluna Esquerda - 3/5 - ESPAÇAMENTO AUMENTADO */}
          <div className="lg:col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

            {/* Descrição completa */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 hover:bg-white/10 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/5">
              <h3 className="text-xl font-bold text-white mb-6">Sobre esta aventura</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                {viagem.descricao}
              </p>
            </div>

            {/* Grid de InfoCards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
                <InfoCard 
                    title="O que está incluso"
                    items={viagem.inclusos}
                    type="incluso"
                />
                <InfoCard
                    title="O que não está incluso"
                    items={viagem.nao_inclusos}
                    type="nao-incluso"
                />
                <InfoCard
                    title="O que levar"
                    items={viagem.o_que_levar}
                    type="o-que-levar"
                />
            </div>
            
            {/* Botões de ação - apenas galeria aqui */}
            {viagem.galeria && viagem.galeria.length > 0 && (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowGallery(true)}
                  className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-semibold flex items-center gap-3 text-lg hover:bg-white/10 transition-colors"
                >
                  <ExternalLink size={24} />
                  Ver Galeria Completa
                </button>
              </div>
            )}
          </div>

          {/* Coluna Direita - 2/5 - Card de Preços */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 lg:sticky lg:top-24 shadow-2xl shadow-black/20 hover:border-white/30 transition-all duration-500">
              {/* Price */}
              <div className="text-center mb-8 pb-8 border-b border-white/10">
                <p className="text-white/50 text-sm mb-2">A partir de</p>
                <p className="text-5xl font-bold gradient-text">
                  {formatCurrency(viagem.preco)}
                </p>
                {viagem.preco_parcelado && (
                  <p className="text-white/50 text-sm mt-2">
                    {viagem.preco_parcelado}
                  </p>
                )}
              </div>

              {/* Detalhes */}
              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-4">
                  <Calendar size={22} className="text-cyan-400" />
                  <div>
                    <p className="text-white/50 text-sm">Data</p>
                    <p className="text-white font-medium">{formatDate(viagem.data_viagem)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock size={22} className="text-cyan-400" />
                  <div>
                    <p className="text-white/50 text-sm">Duração</p>
                    <p className="text-white font-medium">{viagem.duracao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mountain size={22} className="text-cyan-400" />
                  <div>
                    <p className="text-white/50 text-sm">Dificuldade</p>
                    <p className="text-white font-medium">{viagem.dificuldade}</p>
                  </div>
                </div>

                {viagem.local_saida && (
                  <div className="flex items-center gap-4">
                    <MapPin size={22} className="text-cyan-400" />
                    <div>
                      <p className="text-white/50 text-sm">Saída</p>
                      <p className="text-white font-medium">{viagem.local_saida}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <MapPin size={22} className="text-pink-400" />
                  <div>
                    <p className="text-white/50 text-sm">Destino</p>
                    <p className="text-white font-medium">{viagem.destino} - {viagem.estado}</p>
                  </div>
                </div>
              </div>

              {/* Vagas */}
              <div style={{ marginBottom: '4rem' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/50 text-sm">Vagas disponíveis</span>
                  <span className="text-white font-medium">
                    {viagem.vagas_disponiveis} de {viagem.vagas_total}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
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

              {/* Botão WhatsApp no card - SUPER CHAMATIVO */}
              <style>{`
                @keyframes breathe {
                  0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(236, 72, 153, 0.4);
                  }
                  50% {
                    transform: scale(1.03);
                    box-shadow: 0 0 50px rgba(6, 182, 212, 0.7), 0 0 90px rgba(236, 72, 153, 0.5);
                  }
                }
                .btn-breathe {
                  animation: breathe 2s ease-in-out infinite;
                }
                .btn-breathe:hover {
                  animation: none !important;
                }
              `}</style>
              <a
                href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-gradient btn-breathe rounded-2xl text-white font-bold text-xl flex items-center justify-center gap-4 transition-all"
                style={{
                  padding: '1.75rem 2rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(6, 182, 212, 0.8), 0 0 100px rgba(236, 72, 153, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center" style={{ flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                Reservar pelo WhatsApp
              </a>
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

        {/* Navegação removida conforme solicitado */}
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
