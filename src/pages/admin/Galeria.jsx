import { useState, useRef } from 'react'
import { Upload, Trash2, Edit2, X, Check, ChevronUp, ChevronDown, Image } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useGaleriaAdmin } from '../../hooks/useGaleria'
import { useStorage } from '../../hooks/useStorage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Galeria = () => {
  const { fotos, loading, addFoto, updateFoto, deleteFoto, toggleAtivo, reorderFotos } = useGaleriaAdmin()
  const { upload, uploading, progress } = useStorage('galeria')
  const [editingId, setEditingId] = useState(null)
  const [editLegenda, setEditLegenda] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const inputRef = useRef(null)

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    try {
      for (const file of files) {
        const url = await upload(file)
        await addFoto({
          imagem_url: url,
          legenda: '',
          ordem: fotos.length,
          ativo: true
        })
      }
      toast.success(`${files.length} ${files.length === 1 ? 'foto adicionada' : 'fotos adicionadas'}`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Erro ao fazer upload')
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleStartEdit = (foto) => {
    setEditingId(foto.id)
    setEditLegenda(foto.legenda || '')
  }

  const handleSaveEdit = async () => {
    try {
      await updateFoto(editingId, { legenda: editLegenda })
      toast.success('Legenda atualizada')
      setEditingId(null)
      setEditLegenda('')
    } catch (error) {
      toast.error('Erro ao atualizar legenda')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditLegenda('')
  }

  const handleDelete = async (id) => {
    try {
      await deleteFoto(id)
      toast.success('Foto excluída')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error('Erro ao excluir foto')
    }
  }

  const handleToggleAtivo = async (id, currentStatus) => {
    try {
      await toggleAtivo(id, !currentStatus)
      toast.success(currentStatus ? 'Foto ocultada' : 'Foto visível')
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleMoveUp = async (index) => {
    if (index === 0) return
    const newFotos = [...fotos]
    ;[newFotos[index - 1], newFotos[index]] = [newFotos[index], newFotos[index - 1]]
    await reorderFotos(newFotos)
  }

  const handleMoveDown = async (index) => {
    if (index === fotos.length - 1) return
    const newFotos = [...fotos]
    ;[newFotos[index], newFotos[index + 1]] = [newFotos[index + 1], newFotos[index]]
    await reorderFotos(newFotos)
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
      <>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Galeria de Momentos</h1>
            <p className="text-white/60 text-lg">Gerencie as fotos exibidas na seção de momentos</p>
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <button
              disabled={uploading}
              className="btn-gradient px-6 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-3 justify-center disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Enviando... {progress}%
                </>
              ) : (
                <>
                  <Upload size={24} />
                  Adicionar Fotos
                </>
              )}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {fotos.length === 0 ? (
          <div className="glass rounded-3xl p-12 md:p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
              <Image size={48} className="text-white/40" />
            </div>
            <p className="text-white/60 text-xl mb-6">Nenhuma foto na galeria</p>
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg inline-flex items-center gap-3 cursor-pointer">
                <Upload size={24} />
                Clique para adicionar fotos
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fotos.map((foto, index) => (
              <div
                key={foto.id}
                className={`glass rounded-2xl overflow-hidden group ${!foto.ativo ? 'opacity-60' : ''}`}
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={foto.imagem_url}
                    alt={foto.legenda || `Foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-30 transition-all"
                      title="Mover para cima"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === fotos.length - 1}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-30 transition-all"
                      title="Mover para baixo"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-5">
                  {editingId === foto.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editLegenda}
                        onChange={(e) => setEditLegenda(e.target.value)}
                        placeholder="Legenda da foto"
                        className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-3 text-green-400 hover:bg-green-500/10 rounded-xl transition-all"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-white/80 text-base truncate mb-4">
                        {foto.legenda || 'Sem legenda'}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleToggleAtivo(foto.id, foto.ativo)}
                          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                            foto.ativo
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {foto.ativo ? 'Visível' : 'Oculta'}
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStartEdit(foto)}
                            className="p-2.5 text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all"
                            title="Editar legenda"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(foto.id)}
                            className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">Confirmar exclusão</h3>
              <p className="text-white/60 text-lg mb-8">
                Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
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
      </>
    </AdminLayout>
  )
}

export default Galeria
