import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Save, X, Loader, Info, Image as ImageIcon, DollarSign, List, Settings } from 'lucide-react'
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Informações Básicas */}
      <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-cyan-500/5" style={{ padding: '2.5rem' }}>
        <h3 className="text-2xl font-bold text-white flex items-center" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center shadow-lg">
            <Info size={24} className="text-cyan-400" />
          </div>
          Informações Básicas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Título da Viagem <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Pico da Bandeira"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="pico-da-bandeira"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Estado <span className="text-pink-400">*</span>
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors appearance-none cursor-pointer shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            >
              {estados.map(estado => (
                <option key={estado} value={estado} className="bg-blue-900">{estado}</option>
              ))}
            </select>
          </div>

          {/* Descrição Curta */}
          <div className="md:col-span-2">
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Descrição Curta
            </label>
            <input
              type="text"
              name="descricao_curta"
              value={formData.descricao_curta}
              onChange={handleChange}
              maxLength={500}
              placeholder="Breve descrição para o carrossel"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
            />
          </div>

          {/* Descrição Completa */}
          <div className="md:col-span-2">
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Descrição Completa <span className="text-pink-400">*</span>
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={6}
              placeholder="Descrição detalhada da viagem..."
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors resize-none shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>

          {/* Destino */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Destino <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              placeholder="Ex: Parque Nacional do Caparaó"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>

          {/* Local de Saída */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Local de Saída
            </label>
            <input
              type="text"
              name="local_saida"
              value={formData.local_saida}
              onChange={handleChange}
              placeholder="Ex: Shopping Vitória"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
            />
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-green-500/5" style={{ padding: '2.5rem' }}>
        <h3 className="text-2xl font-bold text-white flex items-center" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center shadow-lg">
            <Settings size={24} className="text-green-400" />
          </div>
          Detalhes da Viagem
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
          {/* Data */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Data <span className="text-pink-400">*</span>
            </label>
            <input
              type="date"
              name="data_viagem"
              value={formData.data_viagem}
              onChange={handleChange}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>

          {/* Duração */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Duração <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              placeholder="Ex: 2 dias e 1 noite"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Dificuldade <span className="text-pink-400">*</span>
            </label>
            <select
              name="dificuldade"
              value={formData.dificuldade}
              onChange={handleChange}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors appearance-none cursor-pointer shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            >
              {dificuldades.map(dif => (
                <option key={dif} value={dif} className="bg-blue-900">{dif}</option>
              ))}
            </select>
          </div>

          {/* Vagas Totais */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Vagas Totais <span className="text-pink-400">*</span>
            </label>
            <input
              type="number"
              name="vagas_total"
              value={formData.vagas_total}
              onChange={handleChange}
              min={1}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>

          {/* Vagas Disponíveis */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Vagas Disponíveis <span className="text-pink-400">*</span>
            </label>
            <input
              type="number"
              name="vagas_disponiveis"
              value={formData.vagas_disponiveis}
              onChange={handleChange}
              min={0}
              max={formData.vagas_total}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>
        </div>
      </div>

      {/* Preço */}
      <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-yellow-500/5" style={{ padding: '2.5rem' }}>
        <h3 className="text-2xl font-bold text-white flex items-center" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center shadow-lg">
            <DollarSign size={24} className="text-yellow-400" />
          </div>
          Preço
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
          {/* Valor */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Valor (R$) <span className="text-pink-400">*</span>
            </label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              step="0.01"
              min={0}
              placeholder="650.00"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
              required
            />
          </div>

          {/* Texto Parcelado */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Texto Parcelado
            </label>
            <input
              type="text"
              name="preco_parcelado"
              value={formData.preco_parcelado}
              onChange={handleChange}
              placeholder="ou 12x de R$ 54,17"
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
            />
          </div>
        </div>
      </div>

      {/* Imagens */}
      <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-pink-500/5" style={{ padding: '2.5rem' }}>
        <h3 className="text-2xl font-bold text-white flex items-center" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center shadow-lg">
            <ImageIcon size={24} className="text-pink-400" />
          </div>
          Imagens da Viagem
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Imagem Principal */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Imagem Principal <span className="text-pink-400">*</span>
            </label>
            <p className="text-white/50 text-base" style={{ marginBottom: '1.5rem' }}>
              Esta imagem aparecerá no carrossel principal do site
            </p>
            <ImageUpload
              value={imageFile || formData.imagem_principal}
              onChange={handleImageChange}
              label="Arraste ou clique para adicionar"
              required
              uploading={uploading}
              progress={progress}
            />
          </div>

          {/* Galeria */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Galeria de Fotos
            </label>
            <p className="text-white/50 text-base" style={{ marginBottom: '1.5rem' }}>
              Adicione fotos extras desta aventura (aparecerão na seção "Fotos desta aventura")
            </p>
            <MultipleImageUpload
              values={[...formData.galeria.filter(g => typeof g === 'string'), ...galleryFiles]}
              onChange={handleGalleryChange}
              label="Galeria"
              maxImages={10}
            />
          </div>
        </div>
      </div>

      {/* Listas */}
      <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-purple-500/5" style={{ padding: '2.5rem' }}>
        <h3 className="text-2xl font-bold text-white flex items-center" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center shadow-lg">
            <List size={24} className="text-purple-400" />
          </div>
          Listas de Informações
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Inclusos */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1.5rem' }}>O que está incluso</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formData.inclusos.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('inclusos', index, e.target.value)}
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                    placeholder="Ex: Transporte ida e volta"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('inclusos', index)}
                    className="rounded-2xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem('inclusos')}
              className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 font-semibold text-lg"
              style={{ marginTop: '1.5rem' }}
            >
              <Plus size={22} />
              Adicionar item
            </button>
          </div>

          {/* Não Inclusos */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1.5rem' }}>O que não está incluso</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formData.nao_inclusos.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('nao_inclusos', index, e.target.value)}
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                    placeholder="Ex: Alimentação"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('nao_inclusos', index)}
                    className="rounded-2xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem('nao_inclusos')}
              className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 font-semibold text-lg"
              style={{ marginTop: '1.5rem' }}
            >
              <Plus size={22} />
              Adicionar item
            </button>
          </div>

          {/* O que levar */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1.5rem' }}>O que levar</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formData.o_que_levar.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('o_que_levar', index, e.target.value)}
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                    placeholder="Ex: Mochila de ataque"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('o_que_levar', index)}
                    className="rounded-2xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem('o_que_levar')}
              className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 font-semibold text-lg"
              style={{ marginTop: '1.5rem' }}
            >
              <Plus size={22} />
              Adicionar item
            </button>
          </div>
        </div>
      </div>

      {/* Opções */}
      <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-blue-500/5" style={{ padding: '2.5rem' }}>
        <h3 className="text-2xl font-bold text-white" style={{ marginBottom: '2rem' }}>Opções</h3>
        <div className="flex flex-wrap" style={{ gap: '2.5rem' }}>
          <label className="flex items-center gap-5 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-white/10 rounded-full peer-checked:bg-cyan-500 transition-colors shadow-inner"></div>
              <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg peer-checked:translate-x-7 transition-transform"></div>
            </div>
            <span className="text-white text-xl">Viagem Ativa</span>
          </label>
          <label className="flex items-center gap-5 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="destaque"
                checked={formData.destaque}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-white/10 rounded-full peer-checked:bg-pink-500 transition-colors shadow-inner"></div>
              <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg peer-checked:translate-x-7 transition-transform"></div>
            </div>
            <span className="text-white text-xl">Destaque (aparece primeiro)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center lg:justify-end" style={{ gap: '1.5rem', paddingTop: '2rem' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/viagens')}
          className="rounded-2xl border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors flex items-center shadow-lg"
          style={{ gap: '1rem', padding: '1.5rem 2.5rem' }}
        >
          <X size={24} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="btn-gradient rounded-2xl text-white font-semibold text-lg flex items-center disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          style={{ gap: '1rem', padding: '1.5rem 2.5rem' }}
        >
          {submitting || uploading ? (
            <>
              <Loader size={24} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={24} />
              Salvar Viagem
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ViagemForm
