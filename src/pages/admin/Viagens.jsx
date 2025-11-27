import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Copy, ChevronUp, ChevronDown, MapPin, Search } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useViagensAdmin } from '../../hooks/useViagens'
import { formatCurrency, formatDateShort } from '../../lib/utils'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Viagens = () => {
  const { viagens, loading, deleteViagem, toggleAtivo, reorderViagens } = useViagensAdmin()
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
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Viagens</h1>
          <p className="text-white/60 mt-1">Gerencie suas viagens e expedições</p>
        </div>
        <Link
          to="/admin/viagens/nova"
          className="btn-gradient px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          Nova Viagem
        </Link>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar viagens..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'active' ? 'Ativas' : 'Inativas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        {filteredViagens.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/60 mb-4">
              {search || filter !== 'all' ? 'Nenhuma viagem encontrada' : 'Nenhuma viagem cadastrada'}
            </p>
            {!search && filter === 'all' && (
              <Link
                to="/admin/viagens/nova"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
              >
                <Plus size={18} />
                Criar primeira viagem
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Viagem</th>
                  <th className="text-left py-4 px-4 text-white/60 font-medium text-sm hidden md:table-cell">Data</th>
                  <th className="text-left py-4 px-4 text-white/60 font-medium text-sm hidden lg:table-cell">Preço</th>
                  <th className="text-left py-4 px-4 text-white/60 font-medium text-sm hidden sm:table-cell">Vagas</th>
                  <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Status</th>
                  <th className="text-right py-4 px-4 text-white/60 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredViagens.map((viagem, index) => (
                  <tr key={viagem.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                          {viagem.imagem_principal ? (
                            <img
                              src={viagem.imagem_principal}
                              alt={viagem.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin size={20} className="text-white/40" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{viagem.titulo}</p>
                          <p className="text-white/40 text-sm">{viagem.destino} - {viagem.estado}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white/60 hidden md:table-cell">
                      {formatDateShort(viagem.data_viagem)}
                    </td>
                    <td className="py-4 px-4 text-white/60 hidden lg:table-cell">
                      {formatCurrency(viagem.preco)}
                    </td>
                    <td className="py-4 px-4 text-white/60 hidden sm:table-cell">
                      {viagem.vagas_disponiveis}/{viagem.vagas_total}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleAtivo(viagem.id, viagem.ativo)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          viagem.ativo
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {viagem.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 hidden sm:block"
                          title="Mover para cima"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === viagens.length - 1}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 hidden sm:block"
                          title="Mover para baixo"
                        >
                          <ChevronDown size={18} />
                        </button>
                        <Link
                          to={`/admin/viagens/${viagem.id}/editar`}
                          className="p-2 text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(viagem.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Confirmar exclusão</h3>
            <p className="text-white/60 mb-6">
              Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Viagens
