import { useState, useEffect } from 'react'
import { Trash2, GripVertical, Image as ImageIcon, Loader, Upload } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { compressImage } from '../../lib/imageUtils'

const Galeria = () => {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('galeria_momentos')
        .select('*')
        .order('ordem', { ascending: true })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error('Erro ao buscar fotos:', error)
      toast.error('Erro ao carregar galeria')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const validFiles = files.filter(file => {
      if (file.size > MAX_SIZE) {
        toast.error(`Arquivo ${file.name} excede 5MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    const toastId = toast.loading('Fazendo upload...')

    try {
      const newPhotos = []
      const currentMaxOrder = photos.length > 0 ? Math.max(...photos.map(p => p.ordem)) : 0

      for (let i = 0; i < validFiles.length; i++) {
        const originalFile = validFiles[i]
        const file = await compressImage(originalFile)
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `momentos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('galeria')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('galeria')
          .getPublicUrl(filePath)

        newPhotos.push({
          imagem_url: publicUrl,
          legenda: '',
          ordem: currentMaxOrder + i + 1,
          ativo: true
        })
      }

      const { data: insertedPhotos, error: dbError } = await supabase
        .from('galeria_momentos')
        .insert(newPhotos)
        .select()

      if (dbError) throw dbError

      setPhotos(prev => [...prev, ...insertedPhotos])
      toast.success('Fotos adicionadas com sucesso!', { id: toastId })
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro ao fazer upload', { id: toastId })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleUpdate = async (id, field, value) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

    try {
      const { error } = await supabase
        .from('galeria_momentos')
        .update({ [field]: value })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error('Erro ao salvar alteração')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto?')) return

    try {
      const { error } = await supabase
        .from('galeria_momentos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPhotos(prev => prev.filter(p => p.id !== id))
      toast.success('Foto removida')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      toast.error('Erro ao excluir foto')
    }
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newPhotos = [...photos]
    const draggedItem = newPhotos[draggedIndex]
    newPhotos.splice(draggedIndex, 1)
    newPhotos.splice(index, 0, draggedItem)

    setPhotos(newPhotos)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    setDraggedIndex(null)
    
    try {
      const updates = photos.map((photo, index) => ({
        id: photo.id,
        ordem: index
      }))

      const { error } = await supabase
        .from('galeria_momentos')
        .upsert(updates, { onConflict: 'id' })

      if (error) throw error
      toast.success('Ordem atualizada')
    } catch (error) {
      console.error('Erro ao reordenar:', error)
      toast.error('Erro ao salvar ordem')
    }
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
      <div className="flex flex-col gap-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Galeria de Momentos</h1>
            <p className="text-white/60 text-lg">Gerencie as fotos da seção "Momentos Inesquecíveis"</p>
          </div>
          
          <label className={`btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-3 justify-center cursor-pointer transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
            {uploading ? <Loader size={22} className="animate-spin" /> : <Upload size={22} />}
            <span>{uploading ? 'Enviando...' : 'Adicionar Fotos'}</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleUpload} 
              className="hidden" 
              disabled={uploading}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`glass rounded-2xl overflow-hidden group relative transition-all duration-300 ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:bg-white/5'}`}
            >
              <div className="absolute top-3 left-3 z-10 p-2 bg-black/40 backdrop-blur-md rounded-lg text-white/60 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={20} />
              </div>

              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-3 right-3 z-10 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Excluir foto"
              >
                <Trash2 size={20} />
              </button>

              <div className="aspect-square relative bg-black/20">
                <img
                  src={photo.imagem_url}
                  alt={photo.legenda || 'Foto da galeria'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={() => handleUpdate(photo.id, 'ativo', !photo.ativo)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-colors ${
                      photo.ativo 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {photo.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <input
                  type="text"
                  value={photo.legenda || ''}
                  onChange={(e) => handleUpdate(photo.id, 'legenda', e.target.value)}
                  placeholder="Adicionar legenda..."
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          ))}

          {photos.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center glass rounded-3xl">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={40} className="text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma foto na galeria</h3>
              <p className="text-white/50">Faça upload de imagens para começar.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Galeria