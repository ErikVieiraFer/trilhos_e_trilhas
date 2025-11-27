import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useConfiguracoes } from '../../hooks/useConfiguracoes'
import { useStorage } from '../../hooks/useStorage'
import ImageUpload from '../../components/admin/ImageUpload'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Configuracoes = () => {
  const { config, loading, updateMultiple } = useConfiguracoes()
  const { upload, uploading, progress } = useStorage('galeria')
  const [formData, setFormData] = useState({
    whatsapp: '',
    email: '',
    instagram: '',
    sobre_texto: '',
    num_aventureiros: '',
    num_trilhas: '',
    num_estados: '',
    footer_imagem: ''
  })
  const [saving, setSaving] = useState(false)
  const [footerImageFile, setFooterImageFile] = useState(null)

  useEffect(() => {
    if (config) {
      setFormData(config)
    }
  }, [config])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (file) => {
    setFooterImageFile(file)
    if (file && typeof file !== 'string') {
      setFormData(prev => ({ ...prev, footer_imagem: file }))
    } else if (file === null) {
      setFormData(prev => ({ ...prev, footer_imagem: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      let footerImageUrl = formData.footer_imagem
      if (footerImageFile && typeof footerImageFile !== 'string') {
        footerImageUrl = await upload(footerImageFile, 'footer')
      }

      await updateMultiple({
        ...formData,
        footer_imagem: footerImageUrl
      })

      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Configurações</h1>
        <p className="text-white/60 mt-1">Configure informações gerais do site</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Contact Info */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Informações de Contato</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                WhatsApp <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="5527999999999"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              />
              <p className="text-white/40 text-xs mt-1">Formato: código do país + DDD + número (apenas números)</p>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@trilhosetrilhas.com.br"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/trilhosetrilhases"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Seção Sobre</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Texto Sobre Nós
              </label>
              <textarea
                name="sobre_texto"
                value={formData.sobre_texto}
                onChange={handleChange}
                rows={4}
                placeholder="Texto descritivo sobre a empresa..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Aventureiros
                </label>
                <input
                  type="text"
                  name="num_aventureiros"
                  value={formData.num_aventureiros}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Trilhas
                </label>
                <input
                  type="text"
                  name="num_trilhas"
                  value={formData.num_trilhas}
                  onChange={handleChange}
                  placeholder="50"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Estados
                </label>
                <input
                  type="text"
                  name="num_estados"
                  value={formData.num_estados}
                  onChange={handleChange}
                  placeholder="4"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Image */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Imagem do Footer</h3>
          <ImageUpload
            value={footerImageFile || formData.footer_imagem}
            onChange={handleImageChange}
            label="Imagem de fundo do CTA"
            uploading={uploading}
            progress={progress}
          />
          <p className="text-white/40 text-xs mt-2">
            Recomendado: imagem de paisagem em alta resolução (1920x1080 ou maior)
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-gradient px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving || uploading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default Configuracoes
