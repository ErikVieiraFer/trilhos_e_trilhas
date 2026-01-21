import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Save, X, MessageCircle, HelpCircle, Loader } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const FAQ = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    pergunta: '',
    resposta: '',
    ativo: true,
    ordem: 0
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('ordem', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (error) {
      console.error('Erro ao buscar FAQ:', error)
      toast.error('Erro ao carregar perguntas')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (faq = null) => {
    if (faq) {
      setEditingId(faq.id)
      setFormData(faq)
    } else {
      setEditingId(null)
      setFormData({
        pergunta: '',
        resposta: '',
        ativo: true,
        ordem: faqs.length
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setFormData({ pergunta: '', resposta: '', ativo: true, ordem: 0 })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.pergunta.trim() || !formData.resposta.trim()) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setSaving(true)

    try {
      if (editingId) {
        const { error } = await supabase
          .from('faq')
          .update({
            pergunta: formData.pergunta,
            resposta: formData.resposta,
            ativo: formData.ativo
          })
          .eq('id', editingId)

        if (error) throw error
        
        setFaqs(prev => prev.map(item => 
          item.id === editingId ? { ...item, ...formData } : item
        ))
        toast.success('Pergunta atualizada!')
      } else {
        const { data, error } = await supabase
          .from('faq')
          .insert([{
            ...formData,
            ordem: faqs.length
          }])
          .select()
          .single()

        if (error) throw error
        
        setFaqs(prev => [...prev, data])
        toast.success('Pergunta criada!')
      }
      handleCloseForm()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar pergunta')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pergunta?')) return

    try {
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', id)

      if (error) throw error

      setFaqs(prev => prev.filter(item => item.id !== id))
      toast.success('Pergunta excluída')
    } catch (error) {
      console.error('Erro ao excluir:', error)
      toast.error('Erro ao excluir pergunta')
    }
  }

  const handleToggleAtivo = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('faq')
        .update({ ativo: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setFaqs(prev => prev.map(item => 
        item.id === id ? { ...item, ativo: !currentStatus } : item
      ))
      toast.success(currentStatus ? 'Pergunta desativada' : 'Pergunta ativada')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === faqs.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newFaqs = [...faqs]
    const item = newFaqs[index]
    const swapItem = newFaqs[newIndex]

    // Swap in array
    newFaqs[index] = swapItem
    newFaqs[newIndex] = item

    // Update orders locally
    item.ordem = newIndex
    swapItem.ordem = index

    setFaqs(newFaqs)

    try {
      // Update in DB
      const { error } = await supabase
        .from('faq')
        .upsert([
          { id: item.id, ordem: item.ordem },
          { id: swapItem.id, ordem: swapItem.ordem }
        ])

      if (error) throw error
    } catch (error) {
      console.error('Erro ao reordenar:', error)
      toast.error('Erro ao salvar ordem')
      fetchFAQs() // Revert on error
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size={40} className="text-cyan-400 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Perguntas Frequentes</h1>
            <p className="text-white/60">Gerencie o FAQ do site</p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="btn-gradient px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Pergunta
          </button>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Editar Pergunta' : 'Nova Pergunta'}
                </h2>
                <button onClick={handleCloseForm} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white text-lg font-medium mb-3">Pergunta</label>
                  <input
                    type="text"
                    value={formData.pergunta}
                    onChange={e => setFormData(prev => ({ ...prev, pergunta: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all"
                    required
                    placeholder="Ex: Quais as formas de pagamento?"
                  />
                </div>

                <div>
                  <label className="block text-white text-lg font-medium mb-3">Resposta</label>
                  <textarea
                    value={formData.resposta}
                    onChange={e => setFormData(prev => ({ ...prev, resposta: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all resize-none"
                    required
                    placeholder="Digite a resposta detalhada..."
                  />
                </div>

                <div>
                  <label className="block text-white text-lg font-medium mb-3">Ordem</label>
                  <input
                    type="number"
                    value={formData.ordem}
                    onChange={e => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:outline-none transition-all"
                    required
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-12 h-7 rounded-full p-1 transition-colors ${formData.ativo ? 'bg-green-500' : 'bg-white/10'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-transform ${formData.ativo ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={e => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                      className="hidden"
                    />
                    <span className="text-white font-medium">Ativo</span>
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-3 rounded-xl border-2 border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-gradient px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {faqs.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <HelpCircle size={40} className="text-white/20" />
              </div>
              <p className="text-white/50 text-lg">Nenhuma pergunta cadastrada.</p>
            </div>
          ) : (
            faqs.map((faq, index) => (
              <div key={faq.id} className="glass rounded-2xl p-6 flex gap-6 group hover:bg-white/5 transition-all">
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all"
                  >
                    <ChevronUp size={20} />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === faqs.length - 1}
                    className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className="flex-1 py-2">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-white">{faq.pergunta}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      faq.ativo 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {faq.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed">{faq.resposta}</p>
                </div>

                <div className="flex flex-col gap-2 justify-center border-l border-white/5 pl-6">
                  <button
                    onClick={() => handleOpenForm(faq)}
                    className="p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                    title="Editar"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleToggleAtivo(faq.id, faq.ativo)}
                    className={`p-2 rounded-lg transition-all ${
                      faq.ativo 
                        ? 'text-white/40 hover:text-red-400 hover:bg-red-500/10' 
                        : 'text-white/40 hover:text-green-400 hover:bg-green-500/10'
                    }`}
                    title={faq.ativo ? 'Desativar' : 'Ativar'}
                  >
                    {faq.ativo ? <X size={20} /> : <MessageCircle size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default FAQ