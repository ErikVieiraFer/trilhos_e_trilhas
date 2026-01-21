import { useState, useEffect, useRef } from 'react'
import { Upload, Save, Trash2, X, Image as ImageIcon, Loader, Eye, EyeOff, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useStorage } from '../../hooks/useStorage'
import toast from 'react-hot-toast'

const Galeria = () => {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPhotos, setNewPhotos] = useState([])
  const [uploadingBatch, setUploadingBatch] = useState(false)
  
  const { upload } = useStorage('galeria')
  const fileInputRef = useRef(null)

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('galeria_momentos')
        .select('*')
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error('Error fetching gallery:', error)
      toast.error('Erro ao carregar galeria')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      // Validate types
      const validFiles = files.filter(file => file.type.startsWith('image/'))
      
      const newItems = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        legenda: '',
        ordem: 0
      }))
      setNewPhotos(prev => [...prev, ...newItems])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => {
      const newArr = [...prev]
      URL.revokeObjectURL(newArr[index].preview)
      newArr.splice(index, 1)
      return newArr
    })
  }

  const updateNewPhoto = (index, field, value) => {
    setNewPhotos(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const handleUploadBatch = async () => {
    if (newPhotos.length === 0) return

    try {
      setUploadingBatch(true)
      const uploadPromises = newPhotos.map(async (photo) => {
        const url = await upload(photo.file, 'momentos')
        return {
          imagem_url: url,
          legenda: photo.legenda,
          ordem: parseInt(photo.ordem) || 0,
          ativo: true
        }
      })

      const uploadedData = await Promise.all(uploadPromises)

      const { error } = await supabase
        .from('galeria_momentos')
        .insert(uploadedData)

      if (error) throw error

      toast.success(`${uploadedData.length} fotos adicionadas com sucesso!`)
      
      // Cleanup previews
      newPhotos.forEach(p => URL.revokeObjectURL(p.preview))
      setNewPhotos([])
      fetchPhotos()
    } catch (error) {
      console.error('Error uploading batch:', error)
      toast.error('Erro ao salvar fotos')
    } finally {
      setUploadingBatch(false)
    }
  }

  const handleUpdatePhoto = async (photo) => {
    try {
      const { error } = await supabase
        .from('galeria_momentos')
        .update({
          legenda: photo.legenda,
          ordem: parseInt(photo.ordem) || 0,
          ativo: photo.ativo
        })
        .eq('id', photo.id)

      if (error) throw error
      toast.success('Foto atualizada!')
    } catch (error) {
      console.error('Error updating photo:', error)
      toast.error('Erro ao atualizar foto')
    }
  }

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto?')) return

    try {
      const { error } = await supabase
        .from('galeria_momentos')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setPhotos(prev => prev.filter(p => p.id !== id))
      toast.success('Foto excluída')
    } catch (error) {
      console.error('Error deleting photo:', error)
      toast.error('Erro ao excluir foto')
    }
  }

  const updateLocalPhoto = (id, field, value) => {
    setPhotos(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const toggleActive = async (photo) => {
    const newValue = !photo.ativo
    updateLocalPhoto(photo.id, 'ativo', newValue)
    
    try {
      const { error } = await supabase
        .from('galeria_momentos')
        .update({ ativo: newValue })
        .eq('id', photo.id)

      if (error) throw error
      toast.success(newValue ? 'Foto ativada' : 'Foto desativada')
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Erro ao atualizar status')
      // Revert on error
      updateLocalPhoto(photo.id, 'ativo', !newValue)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Galeria de Momentos</h1>
          <p className="text-white/60 text-lg">Gerencie as fotos da seção "Momentos Inesquecíveis"</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Upload className="text-cyan-400" />
            Adicionar Novas Fotos
          </h2>

          <div 
            className="border-2 border-dashed border-white/20 hover:border-cyan-400/50 rounded-2xl p-8 text-center transition-all cursor-pointer bg-white/5 hover:bg-white/10 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
            />
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-white/60 group-hover:text-cyan-400" />
            </div>
            <p className="text-white/80 text-lg font-medium">Clique para selecionar fotos</p>
            <p className="text-white/40 mt-2">Selecione múltiplas imagens de uma vez</p>
          </div>

          {/* Pending Photos List */}
          {newPhotos.length > 0 && (
            <div className="mt-8 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Fotos Selecionadas ({newPhotos.length})</h3>
                <button onClick={() => setNewPhotos([])} className="text-red-400 hover:text-red-300 text-sm">Limpar tudo</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newPhotos.map((photo, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 relative group">
                    <button
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black/20">
                      <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Legenda</label>
                        <input
                          type="text"
                          value={photo.legenda}
                          onChange={(e) => updateNewPhoto(index, 'legenda', e.target.value)}
                          placeholder="Ex: Trilha do amanhecer"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Ordem</label>
                        <input
                          type="number"
                          value={photo.ordem}
                          onChange={(e) => updateNewPhoto(index, 'ordem', e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleUploadBatch}
                  disabled={uploadingBatch}
                  className="btn-gradient px-8 py-3 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingBatch ? <><Loader size={20} className="animate-spin" /> Enviando...</> : <><Save size={20} /> Salvar Novas Fotos</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Photos Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ImageIcon className="text-pink-400" />
            Fotos Cadastradas
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size={40} className="text-cyan-400 animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
              <ImageIcon size={48} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Nenhuma foto cadastrada na galeria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className={`glass rounded-2xl overflow-hidden transition-all ${!photo.ativo ? 'opacity-60 grayscale' : ''}`}>
                  <div className="aspect-square relative group">
                    <img src={photo.imagem_url} alt={photo.legenda} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => toggleActive(photo)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
                        title={photo.ativo ? 'Ocultar' : 'Mostrar'}
                      >
                        {photo.ativo ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Legenda</label>
                      <input
                        type="text"
                        value={photo.legenda || ''}
                        onChange={(e) => updateLocalPhoto(photo.id, 'legenda', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Ordem</label>
                        <input
                          type="number"
                          value={photo.ordem}
                          onChange={(e) => updateLocalPhoto(photo.id, 'ordem', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => handleUpdatePhoto(photo)}
                          className="h-[38px] px-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg flex items-center justify-center transition-colors"
                          title="Salvar alterações"
                        >
                          <Save size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Galeria