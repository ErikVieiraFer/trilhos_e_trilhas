import { useState, useEffect } from 'react'
import { Save, Loader, MessageCircle, Info, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import ImageUpload from '../../components/admin/ImageUpload'
import { useStorage } from '../../hooks/useStorage'
import toast from 'react-hot-toast'

const Configuracoes = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  // Bucket 'galeria' para a imagem do footer
  const { upload, uploading, progress } = useStorage('galeria')

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor')

      if (error) throw error

      const newConfig = { ...formData }
      data.forEach(item => {
        if (Object.prototype.hasOwnProperty.call(newConfig, item.chave)) {
          newConfig[item.chave] = item.valor
        }
      })
      setFormData(newConfig)
    } catch (error) {
      console.error('Error fetching config:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, footer_imagem: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let footerImageUrl = formData.footer_imagem

      // Upload image if it's a new file
      if (formData.footer_imagem instanceof File) {
        footerImageUrl = await upload(formData.footer_imagem, 'config')
      }

      const updates = [
        { chave: 'whatsapp', valor: formData.whatsapp },
        { chave: 'email', valor: formData.email },
        { chave: 'instagram', valor: formData.instagram },
        { chave: 'sobre_texto', valor: formData.sobre_texto },
        { chave: 'num_aventureiros', valor: formData.num_aventureiros },
        { chave: 'num_trilhas', valor: formData.num_trilhas },
        { chave: 'num_estados', valor: formData.num_estados },
        { chave: 'footer_imagem', valor: footerImageUrl }
      ]

      const { error } = await supabase
        .from('configuracoes')
        .upsert(updates, { onConflict: 'chave' })

      if (error) throw error

      // Update local state with URL if image was uploaded
      if (footerImageUrl !== formData.footer_imagem) {
        setFormData(prev => ({ ...prev, footer_imagem: footerImageUrl }))
      }

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
        <div className="flex justify-center items-center h-64">
          <Loader size={40} className="text-cyan-400 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-white/60 text-lg">Gerencie as informações gerais do site</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Card 1 - Contato */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MessageCircle className="text-cyan-400" />
              Contato e Redes Sociais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-white text-sm font-semibold mb-2">WhatsApp (apenas números)</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="5527999999999"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">E-mail de Contato</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@trilhosetrilhas.com.br"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Link do Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 2 - Sobre Nós */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Info className="text-pink-400" />
              Sobre Nós
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Texto "Sobre Nós"</label>
                <textarea
                  name="sobre_texto"
                  value={formData.sobre_texto}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Nº Aventureiros</label>
                  <input
                    type="number"
                    name="num_aventureiros"
                    value={formData.num_aventureiros}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Nº Trilhas</label>
                  <input
                    type="number"
                    name="num_trilhas"
                    value={formData.num_trilhas}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Nº Estados</label>
                  <input
                    type="number"
                    name="num_estados"
                    value={formData.num_estados}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Footer CTA */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <ImageIcon className="text-purple-400" />
              Imagem do Footer
            </h2>
            <p className="text-white/60 mb-4">Esta imagem aparece como fundo na chamada para ação no final da página inicial.</p>
            <ImageUpload
              value={formData.footer_imagem}
              onChange={handleImageChange}
              bucket="galeria"
              folder="config"
              label="Imagem de Fundo"
              uploading={uploading}
              progress={progress}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-gradient px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-cyan-500/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              {saving || uploading ? (
                <>
                  <Loader size={24} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={24} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default Configuracoes