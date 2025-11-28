import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import ViagemForm from '../../components/admin/ViagemForm'
import { useViagensAdmin } from '../../hooks/useViagens'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const EditarViagem = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { viagens, loading: loadingViagens, updateViagem } = useViagensAdmin()
  const [loading, setLoading] = useState(false)

  const viagem = viagens.find(v => v.id === id)

  useEffect(() => {
    if (!loadingViagens && !viagem) {
      toast.error('Viagem não encontrada')
      navigate('/admin/viagens')
    }
  }, [loadingViagens, viagem, navigate])

  const handleSubmit = async (data) => {
    try {
      setLoading(true)
      await updateViagem(id, data)
      toast.success('Viagem atualizada com sucesso!')
      navigate('/admin/viagens')
    } catch (error) {
      console.error('Error updating viagem:', error)
      toast.error('Erro ao atualizar viagem')
    } finally {
      setLoading(false)
    }
  }

  if (loadingViagens) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (!viagem) {
    return null
  }

  return (
    <AdminLayout>
      <>
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/admin/viagens')}
            className="flex items-center gap-2 text-white/60 hover:text-white"
            style={{ marginBottom: '1rem' }}
          >
            <ChevronLeft size={20} />
            Voltar para viagens
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Editar Viagem</h1>
          <p className="text-white/60 mt-1">{viagem.titulo}</p>
        </div>

        <ViagemForm viagem={viagem} onSubmit={handleSubmit} loading={loading} />
      </>
    </AdminLayout>
  )
}

export default EditarViagem
