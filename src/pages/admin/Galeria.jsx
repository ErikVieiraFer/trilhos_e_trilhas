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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Galeria de Momentos</h1>
          <p className="text-white/60 mt-1">Gerencie as fotos exibidas no site</p>
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
            className="btn-gradient px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 justify-center disabled:opacity-50"
          >
            {uploading ? (
              <>
                <LoadingSpinner size="sm" />
                Enviando... {progress}%
              </>
            ) : (
              <>
                <Upload size={18} />
                Adicionar Fotos
              </>
            )}
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {fotos.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Image size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/60 mb-4">Nenhuma foto na galeria</p>
          <div className="relative inline-block">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
              Clique para adicionar fotos
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fotos.map((foto, index) => (
            <div
              key={foto.id}
              className={`glass rounded-xl overflow-hidden ${!foto.ativo ? 'opacity-60' : ''}`}
            >
              {/* Image */}
              <div className="aspect-square relative group">
                <img
                  src={foto.imagem_url}
                  alt={foto.legenda || `Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fotos.length - 1}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="p-4">
                {editingId === foto.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editLegenda}
                      onChange={(e) => setEditLegenda(e.target.value)}
                      placeholder="Legenda da foto"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-white/60 text-sm mb-3 truncate">
                      {foto.legenda || 'Sem legenda'}
                    </p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleAtivo(foto.id, foto.ativo)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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
                          className="p-2 text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg"
                          title="Editar legenda"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(foto.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Confirmar exclusão</h3>
            <p className="text-white/60 mb-6">
              Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
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

export default Galeria
