import { Calendar, Clock, Mountain, Users, Check, X, Backpack, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/utils'

const ViagemDetails = ({ viagens, activeIndex }) => {
  const viagem = viagens[activeIndex]
  if (!viagem) return null

  return (
    <section id="detalhes" className="py-20 bg-blue-950 relative z-10 -mt-10 rounded-t-[3rem]">
      <div className="container mx-auto px-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass p-6 rounded-2xl text-center">
            <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Data</p>
            <p className="text-white font-bold">{formatDate(viagem.data_viagem)}</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <Clock className="w-8 h-8 text-pink-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Duração</p>
            <p className="text-white font-bold">{viagem.duracao}</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <Mountain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Dificuldade</p>
            <p className="text-white font-bold">{viagem.dificuldade}</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">Vagas</p>
            <p className="text-white font-bold">{viagem.vagas_disponiveis} restantes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-white mb-6">Sobre a Viagem</h2>
              <p className="text-white/80 text-lg leading-relaxed whitespace-pre-line">
                {viagem.descricao}
              </p>
            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusos */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Check className="text-green-400" />
                  O que está incluso
                </h3>
                <ul className="space-y-3">
                  {viagem.inclusos?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Não Inclusos */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <X className="text-red-400" />
                  Não incluso
                </h3>
                <ul className="space-y-3">
                  {viagem.nao_inclusos?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* O que levar */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Backpack className="text-yellow-400" />
                O que levar
              </h3>
              <div className="flex flex-wrap gap-3">
                {viagem.o_que_levar?.map((item, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Price Card */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-3xl sticky top-24 border-2 border-cyan-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign className="text-cyan-400" />
                Investimento
              </h3>
              
              <div className="mb-8">
                <p className="text-white/60 text-sm mb-1">Valor por pessoa</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{formatCurrency(viagem.preco)}</span>
                </div>
                {viagem.preco_parcelado && (
                  <p className="text-cyan-400 font-medium mt-2">{viagem.preco_parcelado}</p>
                )}
              </div>

              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'}?text=Olá! Gostaria de reservar a viagem: ${viagem.titulo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-gradient py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20"
              >
                Reservar Agora
              </a>
              
              <p className="text-white/40 text-xs text-center mt-4">Vagas limitadas. Garanta a sua!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ViagemDetails