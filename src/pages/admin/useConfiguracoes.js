import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useConfiguracoes = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Check cache
        const cached = localStorage.getItem('site_config')
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          // Cache valid for 1 hour
          if (Date.now() - timestamp < 3600000) {
            setConfig(data)
            setLoading(false)
            // Fetch background to update cache if needed
            fetchFromSupabase(true)
            return
          }
        }

        await fetchFromSupabase()
      } catch (error) {
        console.error('Error loading config:', error)
        setLoading(false)
      }
    }

    const fetchFromSupabase = async (background = false) => {
      if (!background) setLoading(true)
      
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor')

      if (error) throw error

      const configObject = {}
      data.forEach(item => {
        configObject[item.chave] = item.valor
      })

      setConfig(configObject)
      localStorage.setItem('site_config', JSON.stringify({
        data: configObject,
        timestamp: Date.now()
      }))
      
      if (!background) setLoading(false)
    }

    fetchConfig()
  }, [])

  return { config, loading }
}