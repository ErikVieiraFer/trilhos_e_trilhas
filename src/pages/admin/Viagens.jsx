import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, MapPin, Search, Star } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useViagensAdmin } from '../../hooks/useViagens'
import { formatCurrency, formatDateShort } from '../../lib/utils'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Viagens = () => {
  const { viagens, loading, deleteViagem, toggleAtivo, toggleDestaque, reorderViagens } = useViagensAdmin()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filteredViagens = viagens.filter(viagem => {
    const matchesSearch = viagem.titulo.toLowerCase().includes(search.toLowerCase()) ||
                          viagem.destino.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' ||
                          (filter === 'active' && viagem.ativo) ||
                          (filter === 'inactive' && !viagem.ativo)
    return matchesSearch && matchesFilter
  })

  const handleDelete = async (id) => {
    try {
      await deleteViagem(id)
      toast.success('Viagem excluída com sucesso')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error('Erro ao excluir viagem')
    }
  }

  const handleToggleAtivo = async (id, currentStatus) => {
    try {
      await toggleAtivo(id, !currentStatus)
      toast.success(currentStatus ? 'Viagem desativada' : 'Viagem ativada')
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleToggleDestaque = async (id, currentStatus) => {
    try {
      if (toggleDestaque) {
        await toggleDestaque(id, !currentStatus)
        toast.success(currentStatus ? 'Removido dos destaques' : 'Adicionado aos destaques')
      } else {
        toast.error('Função não implementada no hook')
      }
    } catch (error) {
      toast.error('Erro ao atualizar destaque')
    }
  }

  const handleMoveUp = async (index) => {
    if (index === 0) return
    const newViagens = [...viagens]
    ;[newViagens[index - 1], newViagens[index]] = [newViagens[index], newViagens[index - 1]]
    await reorderViagens(newViagens)
  }

  const handleMoveDown = async (index) => {
    if (index === viagens.length - 1) return
    const newViagens = [...viagens]
    ;[newViagens[index], newViagens[index + 1]] = [newViagens[index + 1], newViagens[index]]
    await reorderViagens(newViagens)
  }

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between" style={{ gap: '1.5rem', paddingTop: '1.5rem' }}>
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Viagens</h1>
            <p className="text-white/60 text-lg">Gerencie suas viagens e expedições</p>
          </div>
          <Link
            to="/admin/viagens/nova"
            className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-3 justify-center"
          >
            <Plus size={22} />
            Nova Viagem
          </Link>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl" style={{ padding: '2rem' }}>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="relative flex-1">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <Search size={22} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar viagens..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/30 focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none transition-all"
                style={{ paddingLeft: '3.5rem', paddingRight: '1.5rem', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
              />
            </div>
            <div className="flex gap-3">
              {['all', 'active', 'inactive'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-4 rounded-2xl font-semibold text-lg transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {f === 'all' ? 'Todas' : f === 'active' ? 'Ativas' : 'Inativas'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden" style={{ padding: '2rem' }}>
          {filteredViagens.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
                <MapPin size={48} className="text-white/40" />
              </div>
              <p className="text-white/60 text-xl mb-6">
                {search || filter !== 'all' ? 'Nenhuma viagem encontrada' : 'Nenhuma viagem cadastrada'}
              </p>
              {!search && filter === 'all' && (
                <Link
                  to="/admin/viagens/nova"
                  className="inline-flex items-center gap-3 btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg"
                >
                  <Plus size={24} />
                  Criar primeira viagem
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left text-white/60 font-semibold text-base" style={{ padding: '1.5rem 1.5rem' }}>Viagem</th>
                    <th className="text-left text-white/60 font-semibold text-base hidden md:table-cell" style={{ padding: '1.5rem 1.5rem' }}>Data</th>
                    <th className="text-left text-white/60 font-semibold text-base hidden lg:table-cell" style={{ padding: '1.5rem 1.5rem' }}>Preço</th>
                    <th className="text-left text-white/60 font-semibold text-base hidden sm:table-cell" style={{ padding: '1.5rem 1.5rem' }}>Vagas</th>
                    <th className="text-left text-white/60 font-semibold text-base" style={{ padding: '1.5rem 1.5rem' }}>Destaque</th>
                    <th className="text-left text-white/60 font-semibold text-base" style={{ padding: '1.5rem 1.5rem' }}>Status</th>
                    <th className="text-right text-white/60 font-semibold text-base" style={{ padding: '1.5rem 1.5rem' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredViagens.map((viagem, index) => (
                    <tr key={viagem.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td style={{ padding: '1.5rem 1.5rem' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0 shadow-lg">
                            {viagem.imagem_principal ? (
                              <img
                                src={viagem.imagem_principal}
                                alt={viagem.titulo}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MapPin size={24} className="text-white/40" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-lg">{viagem.titulo}</p>
                            <p className="text-white/40 text-base">{viagem.destino} - {viagem.estado}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-white/60 text-base hidden md:table-cell" style={{ padding: '1.5rem 1.5rem' }}>
                        {formatDateShort(viagem.data_viagem)}
                      </td>
                      <td className="text-white/60 text-base hidden lg:table-cell" style={{ padding: '1.5rem 1.5rem' }}>
                        {formatCurrency(viagem.preco)}
                      </td>
                      <td className="text-white/60 text-base hidden sm:table-cell" style={{ padding: '1.5rem 1.5rem' }}>
                        <span className="font-semibold">{viagem.vagas_disponiveis}</span>/{viagem.vagas_total}
                      </td>
                      <td style={{ padding: '1.5rem 1.5rem' }}>
                        <button
                          onClick={() => handleToggleDestaque(viagem.id, viagem.destaque)}
                          className={`p-2 rounded-xl transition-all ${
                            viagem.destaque ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/20 hover:text-yellow-400 hover:bg-yellow-500/10'
                          }`}
                          title={viagem.destaque ? 'Remover destaque' : 'Destacar'}
                        >
                          <Star size={20} className={viagem.destaque ? 'fill-current' : ''} />
                        </button>
                      </td>
                      <td style={{ padding: '1.5rem 1.5rem' }}>
                        <button
                          onClick={() => handleToggleAtivo(viagem.id, viagem.ativo)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            viagem.ativo
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {viagem.ativo ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td style={{ padding: '1.5rem 1.5rem' }}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-xl disabled:opacity-30 hidden sm:block transition-all"
                            title="Mover para cima"
                          >
                            <ChevronUp size={20} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === viagens.length - 1}
                            className="p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-xl disabled:opacity-30 hidden sm:block transition-all"
                            title="Mover para baixo"
                          >
                            <ChevronDown size={20} />
                          </button>
                          <Link
                            to={`/admin/viagens/${viagem.id}/editar`}
                            className="p-3 text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all"
                            title="Editar"
                          >
                            <Edit size={20} />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(viagem.id)}
                            className="p-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">Confirmar exclusão</h3>
              <p className="text-white/60 text-lg mb-8">
                Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-3 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Viagens
