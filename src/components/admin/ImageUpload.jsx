import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react'

const ImageUpload = ({
  value,
  onChange,
  bucket = 'viagens',
  folder = '',
  label = 'Imagem',
  required = false,
  uploading = false,
  progress = 0
}) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-pink-400 ml-1">*</span>}
      </label>

      {value ? (
        <div className="relative group">
          <img
            src={typeof value === 'string' ? value : URL.createObjectURL(value)}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-white/10"
            loading="lazy"
          />
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Loader size={32} className="animate-spin text-cyan-400 mx-auto mb-2" />
                <p className="text-white text-sm">{progress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-white/20 hover:border-white/40'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <ImageIcon size={40} className="mx-auto text-white/40 mb-3" />
          <p className="text-white/60 mb-1">
            Arraste uma imagem ou{' '}
            <span className="text-cyan-400">clique para selecionar</span>
          </p>
          <p className="text-white/40 text-sm">JPEG, PNG ou WebP (max. 5MB)</p>
        </div>
      )}
    </div>
  )
}

export const MultipleImageUpload = ({
  values = [],
  onChange,
  bucket = 'viagens',
  folder = '',
  label = 'Galeria',
  maxImages = 10
}) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).slice(0, maxImages - values.length)
      onChange([...values, ...newFiles])
    }
  }

  const handleChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, maxImages - values.length)
      onChange([...values, ...newFiles])
    }
  }

  const handleRemove = (index) => {
    const newValues = [...values]
    newValues.splice(index, 1)
    onChange(newValues)
  }

  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">
        {label}
        <span className="text-white/40 ml-2">({values.length}/{maxImages})</span>
      </label>

      {/* Image Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {values.map((value, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={typeof value === 'string' ? value : URL.createObjectURL(value)}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-white/10"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {values.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-white/20 hover:border-white/40'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload size={32} className="mx-auto text-white/40 mb-2" />
          <p className="text-white/60 text-sm">
            Arraste imagens ou clique para adicionar
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
