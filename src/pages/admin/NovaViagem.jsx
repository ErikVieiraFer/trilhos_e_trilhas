import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import ViagemForm from '../../components/admin/ViagemForm'
import { useViagensAdmin } from '../../hooks/useViagens'
import toast from 'react-hot-toast'

const NovaViagem = () => {
  const navigate = useNavigate()
  const { createViagem } = useViagensAdmin()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    try {
      setLoading(true)
      await createViagem(data)
      toast.success('Viagem criada com sucesso!')
      navigate('/admin/viagens')
    } catch (error) {
      console.error('Error creating viagem:', error)
      toast.error('Erro ao criar viagem')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Nova Viagem</h1>
          <p className="text-white/60 mt-1">Cadastre uma nova viagem ou expedição</p>
        </div>

        <ViagemForm onSubmit={handleSubmit} loading={loading} />
      </>
    </AdminLayout>
  )
}

export default NovaViagem
