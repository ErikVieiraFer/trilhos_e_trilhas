import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Save, X, Loader } from 'lucide-react'
import ImageUpload, { MultipleImageUpload } from './ImageUpload'
import { generateSlug } from '../../lib/utils'
import { useStorage } from '../../hooks/useStorage'
import toast from 'react-hot-toast'

const ViagemForm = ({ viagem, onSubmit, loading: submitting }) => {
  const navigate = useNavigate()
  const { upload, uploading, progress } = useStorage('viagens')

  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    descricao_curta: '',
    descricao: '',
    destino: '',
    estado: 'ES',
    local_saida: '',
    data_viagem: '',
    duracao: '',
    dificuldade: 'Moderada',
    vagas_total: 20,
    vagas_disponiveis: 20,
    preco: '',
    preco_parcelado: '',
    imagem_principal: null,
    galeria: [],
    inclusos: [''],
    nao_inclusos: [''],
    o_que_levar: [''],
    ativo: true,
    destaque: false
  })

  const [imageFile, setImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  useEffect(() => {
    if (viagem) {
      setFormData({
        ...viagem,
        data_viagem: viagem.data_viagem?.split('T')[0] || '',
        preco: viagem.preco?.toString() || '',
        inclusos: viagem.inclusos?.length > 0 ? viagem.inclusos : [''],
        nao_inclusos: viagem.nao_inclusos?.length > 0 ? viagem.nao_inclusos : [''],
        o_que_levar: viagem.o_que_levar?.length > 0 ? viagem.o_que_levar : ['']
      })
    }
  }, [viagem])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'titulo' && !viagem) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  const handleListChange = (field, index, value) => {
    const newList = [...formData[field]]
    newList[index] = value
    setFormData(prev => ({ ...prev, [field]: newList }))
  }

  const addListItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeListItem = (field, index) => {
    const newList = formData[field].filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      [field]: newList.length > 0 ? newList : ['']
    }))
  }

  const handleImageChange = (file) => {
    setImageFile(file)
    if (file && typeof file !== 'string') {
      setFormData(prev => ({ ...prev, imagem_principal: file }))
    } else if (file === null) {
      setFormData(prev => ({ ...prev, imagem_principal: null }))
    }
  }

  const handleGalleryChange = (files) => {
    setGalleryFiles(files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.titulo || !formData.descricao || !formData.destino ||
        !formData.data_viagem || !formData.duracao || !formData.preco) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    if (!formData.imagem_principal && !imageFile) {
      toast.error('Adicione uma imagem principal')
      return
    }

    try {
      let imagemUrl = formData.imagem_principal

      // Upload main image if it's a new file
      if (imageFile && typeof imageFile !== 'string') {
        imagemUrl = await upload(imageFile, 'main')
      }

      // Upload gallery images
      let galeriaUrls = formData.galeria?.filter(url => typeof url === 'string') || []
      for (const file of galleryFiles) {
        if (typeof file !== 'string') {
          const url = await upload(file, 'gallery')
          galeriaUrls.push(url)
        } else {
          galeriaUrls.push(file)
        }
      }

      const dataToSubmit = {
        ...formData,
        imagem_principal: imagemUrl,
        galeria: galeriaUrls,
        preco: parseFloat(formData.preco),
        inclusos: formData.inclusos.filter(item => item.trim()),
        nao_inclusos: formData.nao_inclusos.filter(item => item.trim()),
        o_que_levar: formData.o_que_levar.filter(item => item.trim())
      }

      await onSubmit(dataToSubmit)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Erro ao salvar viagem')
    }
  }

  const estados = ['ES', 'RJ', 'MG', 'BA']
  const dificuldades = ['Fácil', 'Moderada', 'Difícil', 'Extrema']

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Título <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="Ex: Pico da Bandeira"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="pico-da-bandeira"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Descrição Curta
            </label>
            <input
              type="text"
              name="descricao_curta"
              value={formData.descricao_curta}
              onChange={handleChange}
              maxLength={500}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="Breve descrição para o carrossel"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Descrição Completa <span className="text-pink-400">*</span>
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none"
              placeholder="Descrição detalhada da viagem..."
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Destino <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="Ex: Parque Nacional do Caparaó"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Estado <span className="text-pink-400">*</span>
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            >
              {estados.map(estado => (
                <option key={estado} value={estado} className="bg-blue-900">{estado}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Local de Saída
            </label>
            <input
              type="text"
              name="local_saida"
              value={formData.local_saida}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="Ex: Shopping Vitória"
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detalhes</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Data <span className="text-pink-400">*</span>
            </label>
            <input
              type="date"
              name="data_viagem"
              value={formData.data_viagem}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Duração <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="Ex: 2 dias e 1 noite"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Dificuldade <span className="text-pink-400">*</span>
            </label>
            <select
              name="dificuldade"
              value={formData.dificuldade}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            >
              {dificuldades.map(dif => (
                <option key={dif} value={dif} className="bg-blue-900">{dif}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Vagas Totais <span className="text-pink-400">*</span>
            </label>
            <input
              type="number"
              name="vagas_total"
              value={formData.vagas_total}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Vagas Disponíveis <span className="text-pink-400">*</span>
            </label>
            <input
              type="number"
              name="vagas_disponiveis"
              value={formData.vagas_disponiveis}
              onChange={handleChange}
              min={0}
              max={formData.vagas_total}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preço</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Valor (R$) <span className="text-pink-400">*</span>
            </label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              step="0.01"
              min={0}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="650.00"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Texto Parcelado
            </label>
            <input
              type="text"
              name="preco_parcelado"
              value={formData.preco_parcelado}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
              placeholder="ou 12x de R$ 54,17"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Imagens</h3>
        <div className="space-y-6">
          <ImageUpload
            value={imageFile || formData.imagem_principal}
            onChange={handleImageChange}
            label="Imagem Principal"
            required
            uploading={uploading}
            progress={progress}
          />
          <MultipleImageUpload
            values={[...formData.galeria.filter(g => typeof g === 'string'), ...galleryFiles]}
            onChange={handleGalleryChange}
            label="Galeria"
            maxImages={10}
          />
        </div>
      </div>

      {/* Lists */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Listas</h3>
        <div className="space-y-6">
          {/* Inclusos */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">O que está incluso</label>
            {formData.inclusos.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange('inclusos', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                  placeholder="Ex: Transporte ida e volta"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('inclusos', index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('inclusos')}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              <Plus size={16} />
              Adicionar item
            </button>
          </div>

          {/* Não Inclusos */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">O que não está incluso</label>
            {formData.nao_inclusos.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange('nao_inclusos', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                  placeholder="Ex: Alimentação"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('nao_inclusos', index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('nao_inclusos')}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              <Plus size={16} />
              Adicionar item
            </button>
          </div>

          {/* O que levar */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">O que levar</label>
            {formData.o_que_levar.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange('o_que_levar', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                  placeholder="Ex: Mochila de ataque"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('o_que_levar', index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('o_que_levar')}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              <Plus size={16} />
              Adicionar item
            </button>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Opções</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-white">Viagem Ativa</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="destaque"
              checked={formData.destaque}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500"
            />
            <span className="text-white">Destaque (aparece primeiro)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          type="button"
          onClick={() => navigate('/admin/viagens')}
          className="px-6 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <X size={18} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="btn-gradient px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {submitting || uploading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar Viagem
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ViagemForm
