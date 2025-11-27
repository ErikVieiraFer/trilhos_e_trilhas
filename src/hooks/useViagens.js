import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useViagens = (options = {}) => {
  const [viagens, setViagens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { onlyActive = true, onlyDestaque = false, limit = null } = options

  const fetchViagens = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('viagens')
        .select('*')
        .order('ordem', { ascending: true })
        .order('data_viagem', { ascending: true })

      if (onlyActive) {
        query = query.eq('ativo', true)
      }

      if (onlyDestaque) {
        query = query.eq('destaque', true)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      setViagens(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching viagens:', err)
    } finally {
      setLoading(false)
    }
  }, [onlyActive, onlyDestaque, limit])

  useEffect(() => {
    fetchViagens()
  }, [fetchViagens])

  return { viagens, loading, error, refetch: fetchViagens }
}

export const useViagem = (slug) => {
  const [viagem, setViagem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchViagem = async () => {
      if (!slug) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('viagens')
          .select('*')
          .eq('slug', slug)
          .eq('ativo', true)
          .single()

        if (error) throw error
        setViagem(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching viagem:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchViagem()
  }, [slug])

  return { viagem, loading, error }
}

export const useViagensAdmin = () => {
  const [viagens, setViagens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchViagens = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('viagens')
        .select('*')
        .order('ordem', { ascending: true })

      if (error) throw error
      setViagens(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchViagens()
  }, [fetchViagens])

  const createViagem = async (viagemData) => {
    const { data, error } = await supabase
      .from('viagens')
      .insert([viagemData])
      .select()
      .single()

    if (error) throw error
    await fetchViagens()
    return data
  }

  const updateViagem = async (id, viagemData) => {
    const { data, error } = await supabase
      .from('viagens')
      .update(viagemData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    await fetchViagens()
    return data
  }

  const deleteViagem = async (id) => {
    const { error } = await supabase
      .from('viagens')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchViagens()
  }

  const toggleAtivo = async (id, ativo) => {
    await updateViagem(id, { ativo })
  }

  const reorderViagens = async (viagensReordered) => {
    const updates = viagensReordered.map((viagem, index) => ({
      id: viagem.id,
      ordem: index
    }))

    for (const update of updates) {
      await supabase
        .from('viagens')
        .update({ ordem: update.ordem })
        .eq('id', update.id)
    }

    await fetchViagens()
  }

  return {
    viagens,
    loading,
    error,
    refetch: fetchViagens,
    createViagem,
    updateViagem,
    deleteViagem,
    toggleAtivo,
    reorderViagens
  }
}
