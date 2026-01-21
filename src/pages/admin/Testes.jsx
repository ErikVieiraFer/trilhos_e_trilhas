import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Square, ExternalLink, Smartphone, Globe, Link as LinkIcon, MessageCircle } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

const Testes = () => {
  const testItems = {
    viagens: [
      { id: 'create-viagem', text: 'Criar uma nova viagem pelo painel admin.', link: '/admin/viagens/nova' },
      { id: 'view-viagem', text: 'Verificar se a nova viagem aparece no site público.', link: '/viagens' },
      { id: 'edit-viagem', text: 'Editar a viagem recém-criada (título, preço, etc).', link: '/admin/viagens' },
      { id: 'verify-edit', text: 'Verificar se as alterações foram aplicadas no site.' },
      { id: 'delete-viagem', text: 'Deletar a viagem de teste pelo painel admin.' },
    ],
    galeria: [
      { id: 'upload-gallery', text: 'Fazer upload de múltiplas fotos na galeria de momentos.', link: '/admin/galeria' },
      { id: 'reorder-gallery', text: 'Reordenar as fotos da galeria (arrastar e soltar).', link: '/admin/galeria' },
      { id: 'check-gallery', text: 'Verificar se a galeria no site reflete as mudanças.' },
    ],
    config: [
      { id: 'edit-config', text: 'Editar informações em Configurações (ex: WhatsApp, texto "Sobre").', link: '/admin/configuracoes' },
      { id: 'check-config', text: 'Verificar se as informações foram atualizadas no site (footer, seção sobre, etc).' },
    ],
    responsive: [
      { id: 'mobile-chrome', text: 'Testar o site em modo mobile no Chrome DevTools (F12).' },
      { id: 'mobile-header', text: 'Verificar se o menu hamburger funciona corretamente.' },
      { id: 'mobile-layout', text: 'Verificar se os layouts (cards, grids, footer) se adaptam e empilham corretamente.' },
    ],
    browsers: [
      { id: 'chrome', text: 'Testar funcionalidades principais no Google Chrome.' },
      { id: 'firefox', text: 'Testar funcionalidades principais no Mozilla Firefox.' },
      { id: 'edge-safari', text: 'Testar funcionalidades principais no Edge ou Safari.' },
    ],
    links: [
      { id: 'whatsapp-links', text: 'Verificar se todos os botões de WhatsApp abrem o aplicativo corretamente.' },
      { id: 'internal-links', text: 'Verificar se todos os links internos (navegação, "Ver Detalhes") funcionam.' },
      { id: 'external-links', text: 'Verificar se links externos (Instagram) abrem em uma nova aba.' },
    ],
  }

  const allItems = Object.values(testItems).flat()
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('testChecklist')
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('testChecklist', JSON.stringify(checkedItems))
  }, [checkedItems])

  const handleToggle = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const totalChecked = Object.values(checkedItems).filter(Boolean).length
  const progress = (totalChecked / allItems.length) * 100

  const ChecklistSection = ({ title, items, icon: Icon }) => (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Icon className="text-cyan-400" />
        {title}
      </h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-4">
            <button onClick={() => handleToggle(item.id)} className="mt-1">
              {checkedItems[item.id] ? (
                <CheckSquare size={24} className="text-green-400" />
              ) : (
                <Square size={24} className="text-white/30" />
              )}
            </button>
            <div className="flex-1">
              <p className={`text-lg ${checkedItems[item.id] ? 'text-white/50 line-through' : 'text-white'}`}>
                {item.text}
              </p>
              {item.link && (
                <Link
                  to={item.link}
                  target={item.link.startsWith('/') ? '_blank' : ''}
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 mt-1"
                >
                  <ExternalLink size={14} />
                  {item.link.startsWith('/') ? 'Ir para a página' : 'Abrir link'}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="text-center mb-12 pt-6">
          <h1 className="text-4xl font-bold text-white mb-3">Checklist de Testes Finais</h1>
          <p className="text-white/60 text-lg">Verifique todos os itens antes de publicar o site.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">Progresso</span>
            <span className="text-cyan-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <ChecklistSection
              title="CRUD de Viagens"
              items={testItems.viagens}
              icon={LinkIcon}
            />
            <ChecklistSection
              title="Galeria de Momentos"
              items={testItems.galeria}
              icon={LinkIcon}
            />
            <ChecklistSection
              title="Configurações Gerais"
              items={testItems.config}
              icon={LinkIcon}
            />
          </div>

          <div className="flex flex-col gap-8">
            <ChecklistSection
              title="Responsividade"
              items={testItems.responsive}
              icon={Smartphone}
            />
            <ChecklistSection
              title="Compatibilidade (Navegadores)"
              items={testItems.browsers}
              icon={Globe}
            />
            <ChecklistSection
              title="Links e Redirecionamentos"
              items={testItems.links}
              icon={MessageCircle}
            />
          </div>
        </div>

        {progress === 100 && (
          <div className="mt-12 text-center p-8 glass rounded-3xl border-2 border-green-500/50">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={32} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Tudo pronto!</h2>
            <p className="text-white/70 mt-2">
              Todos os testes foram concluídos. O site está pronto para ser lançado!
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Testes