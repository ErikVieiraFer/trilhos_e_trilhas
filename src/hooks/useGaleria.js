import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useGaleria = (onlyActive = true) => {
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFotos = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('galeria_momentos')
        .select('*')
        .order('ordem', { ascending: true })

      if (onlyActive) {
        query = query.eq('ativo', true)
      }

      const { data, error } = await query

      if (error) throw error
      setFotos(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching galeria:', err)
    } finally {
      setLoading(false)
    }
  }, [onlyActive])

  useEffect(() => {
    fetchFotos()
  }, [fetchFotos])

  return { fotos, loading, error, refetch: fetchFotos }
}

export const useGaleriaAdmin = () => {
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFotos = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('galeria_momentos')
        .select('*')
        .order('ordem', { ascending: true })

      if (error) throw error
      setFotos(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFotos()
  }, [fetchFotos])

  const addFoto = async (fotoData) => {
    const { data, error } = await supabase
      .from('galeria_momentos')
      .insert([fotoData])
      .select()
      .single()

    if (error) throw error
    await fetchFotos()
    return data
  }

  const updateFoto = async (id, fotoData) => {
    const { data, error } = await supabase
      .from('galeria_momentos')
      .update(fotoData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    await fetchFotos()
    return data
  }

  const deleteFoto = async (id) => {
    const { error } = await supabase
      .from('galeria_momentos')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchFotos()
  }

  const toggleAtivo = async (id, ativo) => {
    await updateFoto(id, { ativo })
  }

  const reorderFotos = async (fotosReordered) => {
    const updates = fotosReordered.map((foto, index) => ({
      id: foto.id,
      ordem: index
    }))

    for (const update of updates) {
      await supabase
        .from('galeria_momentos')
        .update({ ordem: update.ordem })
        .eq('id', update.id)
    }

    await fetchFotos()
  }

  return {
    fotos,
    loading,
    error,
    refetch: fetchFotos,
    addFoto,
    updateFoto,
    deleteFoto,
    toggleAtivo,
    reorderFotos
  }
}
