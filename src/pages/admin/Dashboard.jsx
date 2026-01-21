import { Link } from 'react-router-dom'
import { Map, Users, Calendar, Plus, ArrowRight, Images, Settings } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useViagensAdmin } from '../../hooks/useViagens'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateShort } from '../../lib/utils'

const Dashboard = () => {
  const { viagens, loading } = useViagensAdmin()

  const activeViagens = viagens.filter(v => v.ativo)
  const totalVagas = activeViagens.reduce((sum, v) => sum + (v.vagas_disponiveis || 0), 0)
  const nextViagem = activeViagens
    .filter(v => new Date(v.data_viagem) >= new Date())
    .sort((a, b) => new Date(a.data_viagem) - new Date(b.data_viagem))[0]

  const stats = [
    {
      label: 'Viagens Ativas',
      value: activeViagens.length,
      icon: Map,
      gradient: 'from-cyan-500 to-blue-500',
      shadow: 'shadow-cyan-500/30'
    },
    {
      label: 'Vagas Disponíveis',
      value: totalVagas,
      icon: Users,
      gradient: 'from-pink-500 to-rose-500',
      shadow: 'shadow-pink-500/30'
    },
    {
      label: 'Próxima Viagem',
      value: nextViagem ? formatDateShort(nextViagem.data_viagem) : '-',
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-green-500/30'
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {/* Header */}
        <div className="text-center" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
          <h1 className="text-5xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-white/60 text-xl">Bem-vindo ao painel administrativo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl ${stat.shadow} group hover:scale-[1.02] transition-all duration-300`}
                style={{ padding: '2.5rem' }}
              >
                {/* Background gradient decorativo */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${stat.gradient} rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`} />

                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`} style={{ marginBottom: '1.5rem' }}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <p className="text-white/60 text-lg font-medium mb-2">{stat.label}</p>
                  <p className="text-5xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-3xl" style={{ padding: '2.5rem' }}>
          <h2 className="text-2xl font-bold text-white" style={{ marginBottom: '2rem' }}>Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '1.5rem' }}>
            <Link
              to="/admin/viagens/nova"
              className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold text-lg hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span>Nova Viagem</span>
            </Link>

            <Link
              to="/admin/galeria"
              className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border-2 border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Images size={24} className="text-pink-400" />
              </div>
              <span>Gerenciar Galeria</span>
            </Link>

            <Link
              to="/admin/configuracoes"
              className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border-2 border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Settings size={24} className="text-purple-400" />
              </div>
              <span>Configurações</span>
            </Link>
          </div>
        </div>

        {/* Recent Viagens */}
        <div className="glass rounded-3xl" style={{ padding: '2.5rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
            <h2 className="text-2xl font-bold text-white">Viagens Recentes</h2>
            <Link
              to="/admin/viagens"
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium text-lg transition-colors"
            >
              Ver todas
              <ArrowRight size={20} />
            </Link>
          </div>

          {viagens.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
                <Map size={48} className="text-white/40" />
              </div>
              <p className="text-white/60 text-xl mb-6">Nenhuma viagem cadastrada ainda</p>
              <Link
                to="/admin/viagens/nova"
                className="inline-flex items-center gap-3 btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg"
              >
                <Plus size={24} />
                Criar primeira viagem
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {viagens.slice(0, 5).map((viagem) => (
                <Link
                  key={viagem.id}
                  to={`/admin/viagens/${viagem.id}/editar`}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                    <img
                      src={viagem.imagem_principal || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200'}
                      alt={viagem.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-xl truncate group-hover:text-cyan-400 transition-colors">
                      {viagem.titulo}
                    </h3>
                    <p className="text-white/50 text-base mt-1">
                      {viagem.destino} • {formatDateShort(viagem.data_viagem)}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${viagem.ativo ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                    {viagem.ativo ? 'Ativa' : 'Inativa'}
                  </div>
                  <ArrowRight size={24} className="text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
