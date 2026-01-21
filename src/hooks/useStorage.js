import { useState } from 'react'
import { supabase } from '../lib/supabase'

export const useStorage = (bucket) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const upload = async (file, folder = '') => {
    try {
      setUploading(true)
      setProgress(0)

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Máximo permitido: 5MB.')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}${folder ? '/' : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Simulate progress since Supabase doesn't provide real progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)
      setProgress(100)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 500)
    }
  }

  const uploadMultiple = async (files, folder = '') => {
    const urls = []
    for (const file of files) {
      const url = await upload(file, folder)
      urls.push(url)
    }
    return urls
  }

  const remove = async (path) => {
    try {
      // Extract path from full URL if necessary
      let filePath = path
      if (path.includes('/storage/v1/object/public/')) {
        filePath = path.split('/storage/v1/object/public/')[1]
        filePath = filePath.replace(`${bucket}/`, '')
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  return {
    upload,
    uploadMultiple,
    remove,
    uploading,
    progress
  }
}
