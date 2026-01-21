import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Plus, Trash2, Save, X, Loader, Info, Image as ImageIcon, DollarSign, List, Settings } from 'lucide-react'
import ImageUpload, { MultipleImageUpload } from './ImageUpload'
import { generateSlug } from '../../lib/utils'
import { useStorage } from '../../hooks/useStorage'
import { compressImage } from '../../lib/imageUtils'

const ViagemForm = ({ viagem, onSubmit, loading: submitting }) => {
  const navigate = useNavigate()
  const { upload, uploading, progress } = useStorage('viagens')

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
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
      inclusos: [{ value: '' }],
      nao_inclusos: [{ value: '' }],
      o_que_levar: [{ value: '' }],
      ativo: true,
      destaque: false
    }
  })

  const { fields: inclusosFields, append: appendIncluso, remove: removeIncluso } = useFieldArray({ control, name: 'inclusos' })
  const { fields: naoInclusosFields, append: appendNaoIncluso, remove: removeNaoIncluso } = useFieldArray({ control, name: 'nao_inclusos' })
  const { fields: oQueLevarFields, append: appendOQueLevar, remove: removeOQueLevar } = useFieldArray({ control, name: 'o_que_levar' })

  const titulo = watch('titulo')

  // Auto-generate slug from title if creating new
  useEffect(() => {
    if (!viagem && titulo) {
      setValue('slug', generateSlug(titulo))
    }
  }, [titulo, viagem, setValue])

  useEffect(() => {
    if (viagem) {
      // Reset form with existing data
      const formData = {
        ...viagem,
        data_viagem: viagem.data_viagem?.split('T')[0] || '',
        preco: viagem.preco?.toString() || '',
        inclusos: viagem.inclusos?.length > 0 ? viagem.inclusos.map(i => ({ value: i })) : [{ value: '' }],
        nao_inclusos: viagem.nao_inclusos?.length > 0 ? viagem.nao_inclusos.map(i => ({ value: i })) : [{ value: '' }],
        o_que_levar: viagem.o_que_levar?.length > 0 ? viagem.o_que_levar.map(i => ({ value: i })) : [{ value: '' }]
      }
      
      Object.keys(formData).forEach(key => {
        setValue(key, formData[key])
      })
    }
  }, [viagem, setValue])

  const onFormSubmit = async (data) => {
    try {
      let imagemUrl = data.imagem_principal

      // Upload main image if it's a new file
      if (data.imagem_principal instanceof File) {
        imagemUrl = await upload(compressedMain, 'main')
      }

      // Upload gallery images
      const galeriaUrls = []
      for (const file of data.galeria) {
        if (file instanceof File) {
          const compressedGallery =y, 'gallery')
          galeriaUrls.push(url)
        } else {
          galeriaUrls.push(file)
        }
      }

      const dataToSubmit = {
        ...data,
        imagem_principal: imagemUrl,
        galeria: galeriaUrls,
        preco: parseFloat(data.preco),
        inclusos: data.inclusos.map(i => i.value).filter(i => i.trim()),
        nao_inclusos: data.nao_inclusos.map(i => i.value).filter(i => i.trim()),
        o_que_levar: data.o_que_levar.map(i => i.value).filter(i => i.trim())
      }

      await onSubmit(dataToSubmit)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const estados = ['ES', 'RJ', 'MG', 'BA']
  const dificuldades = ['Fácil', 'Moderada', 'Difícil', 'Extrema']

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
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
              {...register('titulo', { required: 'Título é obrigatório' })}
              placeholder="Ex: Pico da Bandeira"
              className={`w-full bg-white/5 border-2 ${errors.titulo ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg`}
              style={{ padding: '1.25rem 1.5rem' }}
            />
            {errors.titulo && <span className="text-red-400 text-sm mt-1">{errors.titulo.message}</span>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Slug (URL)
            </label>
            <input 
              {...register('slug')}
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
              {...register('estado')}
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
              {...register('descricao_curta')}
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
              {...register('descricao', { required: 'Descrição é obrigatória' })}
              rows={6}
              placeholder="Descrição detalhada da viagem..."
              className={`w-full bg-white/5 border-2 ${errors.descricao ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors resize-none shadow-lg`}
              style={{ padding: '1.25rem 1.5rem' }}
            />
            {errors.descricao && <span className="text-red-400 text-sm mt-1">{errors.descricao.message}</span>}
          </div>

          {/* Destino */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Destino <span className="text-pink-400">*</span>
            </label>
            <input 
              {...register('destino', { required: 'Destino é obrigatório' })}
              placeholder="Ex: Parque Nacional do Caparaó"
              className={`w-full bg-white/5 border-2 ${errors.destino ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg`}
              style={{ padding: '1.25rem 1.5rem' }}
            />
            {errors.destino && <span className="text-red-400 text-sm mt-1">{errors.destino.message}</span>}
          </div>

          {/* Local de Saída */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Local de Saída
            </label>
            <input 
              {...register('local_saida')}
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
              {...register('data_viagem', { required: 'Data é obrigatória' })}
              type="date"
              className={`w-full bg-white/5 border-2 ${errors.data_viagem ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg`}
              style={{ padding: '1.25rem 1.5rem' }}
            />
            {errors.data_viagem && <span className="text-red-400 text-sm mt-1">{errors.data_viagem.message}</span>}
          </div>

          {/* Duração */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Duração <span className="text-pink-400">*</span>
            </label>
            <input 
              {...register('duracao', { required: 'Duração é obrigatória' })}
              placeholder="Ex: 2 dias e 1 noite"
              className={`w-full bg-white/5 border-2 ${errors.duracao ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg`}
              style={{ padding: '1.25rem 1.5rem' }}
            />
            {errors.duracao && <span className="text-red-400 text-sm mt-1">{errors.duracao.message}</span>}
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Dificuldade <span className="text-pink-400">*</span>
            </label>
            <select 
              {...register('dificuldade')}
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
              {...register('vagas_total', { required: true, min: 1 })}
              type="number"
              min={1}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
            />
          </div>

          {/* Vagas Disponíveis */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Vagas Disponíveis <span className="text-pink-400">*</span>
            </label>
            <input 
              {...register('vagas_disponiveis', { required: true, min: 0 })}
              type="number"
              min={0}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
              style={{ padding: '1.25rem 1.5rem' }}
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
              {...register('preco', { required: 'Preço é obrigatório' })}
              type="number"
              step="0.01"
              min={0}
              placeholder="650.00"
              className={`w-full bg-white/5 border-2 ${errors.preco ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-lg placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg`}
              style={{ padding: '1.25rem 1.5rem' }}
            />
            {errors.preco && <span className="text-red-400 text-sm mt-1">{errors.preco.message}</span>}
          </div>

          {/* Texto Parcelado */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Texto Parcelado
            </label>
            <input 
              {...register('preco_parcelado')}
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
            <Controller
              control={control}
              name="imagem_principal"
              rules={{ required: 'Imagem principal é obrigatória' }}
              render={({ field: { value, onChange } }) => (
                <ImageUpload
                  value={value}
                  onChange={onChange}
                  label="Arraste ou clique para adicionar"
                  required
                  uploading={uploading}
                  progress={progress}
                />
              )}
            />
            {errors.imagem_principal && <span className="text-red-400 text-sm mt-1">{errors.imagem_principal.message}</span>}
          </div>

          {/* Galeria */}
          <div>
            <label className="block text-white text-lg font-semibold" style={{ marginBottom: '1rem' }}>
              Galeria de Fotos
            </label>
            <p className="text-white/50 text-base" style={{ marginBottom: '1.5rem' }}>
              Adicione fotos extras desta aventura (aparecerão na seção "Fotos desta aventura")
            </p>
            <Controller
              control={control}
              name="galeria"
              render={({ field: { value, onChange } }) => (
                <MultipleImageUpload
                  values={value}
                  onChange={onChange}
                  label="Galeria"
                  maxImages={10}
                />
              )}
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
              {inclusosFields.map((field, index) => (
                <div key={index} className="flex gap-4">
                  <input 
                    {...register(`inclusos.${index}.value`)}
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                    placeholder="Ex: Transporte ida e volta"
                  />
                  <button
                    type="button"
                    onClick={() => removeIncluso(index)}
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
              onClick={() => appendIncluso({ value: '' })}
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
              {naoInclusosFields.map((field, index) => (
                <div key={index} className="flex gap-4">
                  <input 
                    {...register(`nao_inclusos.${index}.value`)}
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                    placeholder="Ex: Alimentação"
                  />
                  <button
                    type="button"
                    onClick={() => removeNaoIncluso(index)}
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
              onClick={() => appendNaoIncluso({ value: '' })}
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
              {oQueLevarFields.map((field, index) => (
                <div key={index} className="flex gap-4">
                  <input 
                    {...register(`o_que_levar.${index}.value`)}
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-cyan-500/50 focus:outline-none transition-colors shadow-lg"
                    style={{ padding: '1.25rem 1.5rem' }}
                    placeholder="Ex: Mochila de ataque"
                  />
                  <button
                    type="button"
                    onClick={() => removeOQueLevar(index)}
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
              onClick={() => appendOQueLevar({ value: '' })}
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
                {...register('ativo')}
                type="checkbox"
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
                {...register('destaque')}
                type="checkbox"
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
