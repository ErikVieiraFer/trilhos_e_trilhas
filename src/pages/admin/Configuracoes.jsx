import { useState, useEffect } from 'react'
import { Save, Loader, Phone, Mail, Instagram, Users, Mountain, MapPin, Image as ImageIcon, Info } from 'lucide-react'
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
      toast.error('Erro ao salvar configurações')
      console.error(error)
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
      <>
        {/* Header - CENTRALIZADO */}
        <div style={{ textAlign: 'center' }}>
          <h1 className="text-4xl font-bold text-white mb-3">Configurações</h1>
          <p className="text-white/60 text-lg">Configure as informações gerais do site</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Card Contato */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Phone size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações de Contato</h2>
                <p className="text-white/50">Dados para os clientes entrarem em contato</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* WhatsApp */}
              <div>
                <label className="block text-white text-lg font-medium mb-3">
                  WhatsApp <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400" size={22} />
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="5527999999999"
                    className="w-full pl-14 pr-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/30 focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none transition-all"
                  />
                </div>
                <p className="text-white/40 text-sm mt-2 ml-2">Formato: código do país + DDD + número (apenas números)</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-lg font-medium mb-3">Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400" size={22} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contato@trilhosetrilhas.com.br"
                    className="w-full pl-14 pr-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/30 focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-white text-lg font-medium mb-3">Instagram</label>
                <div className="relative">
                  <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400" size={22} />
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/trilhosetrilhases"
                    className="w-full pl-14 pr-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/30 focus:border-pink-500/50 focus:bg-white/10 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card Sobre */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Info size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Seção Sobre</h2>
                <p className="text-white/50">Informações exibidas na seção "Sobre Nós"</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Texto Sobre */}
              <div>
                <label className="block text-white text-lg font-medium mb-3">Texto Sobre Nós</label>
                <textarea
                  name="sobre_texto"
                  value={formData.sobre_texto}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Descreva sua empresa..."
                  className="w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Estatísticas */}
              <div>
                <label className="block text-white text-lg font-medium mb-4">Estatísticas em Destaque</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Users size={24} className="text-cyan-400" />
                      <span className="text-white/70 font-medium">Aventureiros</span>
                    </div>
                    <input
                      type="text"
                      name="num_aventureiros"
                      value={formData.num_aventureiros}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full px-5 py-4 bg-white/10 border-2 border-white/10 rounded-xl text-white text-2xl font-bold text-center placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Mountain size={24} className="text-green-400" />
                      <span className="text-white/70 font-medium">Trilhas</span>
                    </div>
                    <input
                      type="text"
                      name="num_trilhas"
                      value={formData.num_trilhas}
                      onChange={handleChange}
                      placeholder="50"
                      className="w-full px-5 py-4 bg-white/10 border-2 border-white/10 rounded-xl text-white text-2xl font-bold text-center placeholder-white/30 focus:border-green-500/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin size={24} className="text-pink-400" />
                      <span className="text-white/70 font-medium">Estados</span>
                    </div>
                    <input
                      type="text"
                      name="num_estados"
                      value={formData.num_estados}
                      onChange={handleChange}
                      placeholder="4"
                      className="w-full px-5 py-4 bg-white/10 border-2 border-white/10 rounded-xl text-white text-2xl font-bold text-center placeholder-white/30 focus:border-pink-500/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <ImageIcon size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Imagem do Footer</h2>
                <p className="text-white/50">Imagem de fundo da seção de CTA</p>
              </div>
            </div>

            <ImageUpload
              value={footerImageFile || formData.footer_imagem}
              onChange={handleImageChange}
              label="Arraste uma imagem ou clique para selecionar"
              uploading={uploading}
              progress={progress}
            />
            <p className="text-white/40 text-sm mt-4 text-center">
              Recomendado: imagem de paisagem em alta resolução (1920×1080 ou maior)
            </p>
          </div>

          {/* Botão Salvar - CENTRALIZADO */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-gradient px-10 py-5 rounded-2xl text-white font-bold text-lg flex items-center gap-3 disabled:opacity-50"
            >
              {saving || uploading ? (
                <>
                  <Loader size={24} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={24} />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      </>
    </AdminLayout>
  )
}

export default Configuracoes
