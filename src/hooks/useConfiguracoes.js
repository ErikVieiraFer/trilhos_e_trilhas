import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const defaultConfigs = {
  whatsapp: '5527999999999',
  email: 'contato@trilhosetrilhas.com.br',
  instagram: 'https://instagram.com/trilhosetrilhases',
  sobre_texto: 'Somos uma empresa de turismo de aventura do Espírito Santo, especializada em trilhas, viagens a praias, campings e expedições noturnas.',
  num_aventureiros: '500',
  num_trilhas: '50',
  num_estados: '4',
  footer_imagem: ''
}

export const useConfiguracoes = () => {
  const [config, setConfig] = useState(defaultConfigs)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchConfiguracoes = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')

      if (error) throw error

      const configObj = { ...defaultConfigs }
      data?.forEach(item => {
        configObj[item.chave] = item.valor
      })

      setConfig(configObj)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching configuracoes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfiguracoes()
  }, [fetchConfiguracoes])

  const updateConfig = async (chave, valor) => {
    const { error } = await supabase
      .from('configuracoes')
      .upsert({ chave, valor }, { onConflict: 'chave' })

    if (error) throw error
    await fetchConfiguracoes()
  }

  const updateMultiple = async (configs) => {
    const updates = Object.entries(configs).map(([chave, valor]) => ({
      chave,
      valor
    }))

    for (const update of updates) {
      await supabase
        .from('configuracoes')
        .upsert(update, { onConflict: 'chave' })
    }

    await fetchConfiguracoes()
  }

  return {
    config,
    loading,
    error,
    refetch: fetchConfiguracoes,
    updateConfig,
    updateMultiple
  }
}
