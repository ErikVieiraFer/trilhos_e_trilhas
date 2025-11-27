import { Link } from 'react-router-dom'
import { MapPin, Users, Calendar, Plus, ArrowRight } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useViagensAdmin } from '../../hooks/useViagens'
import { formatCurrency, formatDateShort } from '../../lib/utils'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Dashboard = () => {
  const { viagens, loading } = useViagensAdmin()

  const activeViagens = viagens.filter(v => v.ativo)
  const totalVagas = activeViagens.reduce((acc, v) => acc + v.vagas_disponiveis, 0)
  const nextViagem = activeViagens
    .filter(v => new Date(v.data_viagem) >= new Date())
    .sort((a, b) => new Date(a.data_viagem) - new Date(b.data_viagem))[0]

  const stats = [
    {
      label: 'Viagens Ativas',
      value: activeViagens.length,
      icon: MapPin,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20'
    },
    {
      label: 'Vagas Disponíveis',
      value: totalVagas,
      icon: Users,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20'
    },
    {
      label: 'Próxima Viagem',
      value: nextViagem ? formatDateShort(nextViagem.data_viagem) : '-',
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60 mt-1">Visão geral do seu painel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="glass rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/viagens/nova"
            className="btn-gradient px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Viagem
          </Link>
          <Link
            to="/admin/galeria"
            className="px-4 py-2 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Gerenciar Galeria
          </Link>
          <Link
            to="/admin/configuracoes"
            className="px-4 py-2 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Configurações
          </Link>
        </div>
      </div>

      {/* Recent Viagens */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Viagens Recentes</h2>
          <Link
            to="/admin/viagens"
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm"
          >
            Ver todas
            <ArrowRight size={16} />
          </Link>
        </div>

        {viagens.length === 0 ? (
          <div className="text-center py-8">
            <MapPin size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/60">Nenhuma viagem cadastrada</p>
            <Link
              to="/admin/viagens/nova"
              className="inline-flex items-center gap-2 mt-4 text-cyan-400 hover:text-cyan-300"
            >
              <Plus size={18} />
              Criar primeira viagem
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-white/60 font-medium text-sm">Viagem</th>
                  <th className="text-left py-3 px-2 text-white/60 font-medium text-sm hidden sm:table-cell">Data</th>
                  <th className="text-left py-3 px-2 text-white/60 font-medium text-sm hidden md:table-cell">Preço</th>
                  <th className="text-left py-3 px-2 text-white/60 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {viagens.slice(0, 5).map((viagem) => (
                  <tr key={viagem.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                          {viagem.imagem_principal ? (
                            <img
                              src={viagem.imagem_principal}
                              alt={viagem.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin size={16} className="text-white/40" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{viagem.titulo}</p>
                          <p className="text-white/40 text-xs">{viagem.destino} - {viagem.estado}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-white/60 text-sm hidden sm:table-cell">
                      {formatDateShort(viagem.data_viagem)}
                    </td>
                    <td className="py-3 px-2 text-white/60 text-sm hidden md:table-cell">
                      {formatCurrency(viagem.preco)}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          viagem.ativo
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {viagem.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Dashboard
