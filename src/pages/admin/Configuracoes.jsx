import { useState, useEffect } from 'react'
import { Save, Upload, Loader, Image as ImageIcon } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { compressImage } from '../../lib/imageUtils'

const Configuracoes = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    whatsapp: '',
    email: '',
    instagram: '',
    sobre_nos: '',
    num_aventureiros: '',
    num_trilhas: '',
    num_estados: '',
    imagem_footer: ''
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e) => {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    if (originalFile.size > 10 * 1024 * 1024) { // Increased limit for pre-compression check
      toast.error('A imagem deve ter no máximo 10MB')
      return
    }

    try {
      setUploading(true)
      const file = await compressImage(originalFile)
      const fileExt = file.name.split('.').pop()
      const fileName = `footer-${Date.now()}.${fileExt}`
      const filePath = `config/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('galeria')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('galeria')
        .getPublicUrl(filePath)

      setFormData(prev => ({
        ...prev,
        imagem_footer: publicUrl
      }))
      
      toast.success('Imagem enviada com sucesso')
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email inválido')
      return
    }

    setSaving(true)

    try {
      const { data: existing } = await supabase
        .from('configuracoes')
        .select('id')
        .single()

      let error
      if (existing) {
        const { error: updateError } = await supabase
          .from('configuracoes')
          .update(formData)
          .eq('id', existing.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('configuracoes')
          .insert([formData])
        error = insertError
      }

      if (error) throw error
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
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
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Configurações Gerais</h1>
            <p className="text-white/60">Gerencie as informações principais do site</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="btn-gradient px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
            Salvar Alterações
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {/* Contato */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">1</span>
              Informações de Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white text-lg font-medium mb-3">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="5527999999999"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-white text-lg font-medium mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@trilhosetrilhas.com.br"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-white text-lg font-medium mb-3">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@trilhosetrilhas"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sobre Nós */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">2</span>
              Sobre Nós
            </h2>
            <div>
              <label className="block text-white text-lg font-medium mb-3">Texto da Seção</label>
              <textarea
                name="sobre_nos"
                value={formData.sobre_nos}
                onChange={handleChange}
                rows={6}
                placeholder="Escreva sobre a empresa..."
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Estatísticas */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm">3</span>
              Estatísticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white text-lg font-medium mb-3">Aventureiros</label>
                <input
                  type="number"
                  name="num_aventureiros"
                  value={formData.num_aventureiros}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-white text-lg font-medium mb-3">Trilhas Realizadas</label>
                <input
                  type="number"
                  name="num_trilhas"
                  value={formData.num_trilhas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-white text-lg font-medium mb-3">Estados Visitados</label>
                <input
                  type="number"
                  name="num_estados"
                  value={formData.num_estados}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Imagem Footer */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-sm">4</span>
              Imagem do Footer (CTA)
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden bg-white/5 border-2 border-white/10 relative group">
                {formData.imagem_footer ? (
                  <img
                    src={formData.imagem_footer}
                    alt="Footer CTA"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ImageIcon size={48} />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-white text-lg font-medium mb-3">Alterar Imagem</label>
                <p className="text-white/50 mb-6">
                  Recomendado: 1920x600px ou similar. Formatos: JPG, PNG, WEBP.
                </p>
                <label className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white cursor-pointer transition-all border border-white/10">
                  <Upload size={20} />
                  <span>Escolher Arquivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Configuracoes