import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Images,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  User,
  PanelLeftClose,
  PanelLeft,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Para mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return false
  })

  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Detectar se é desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  // Salvar estado no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/viagens', label: 'Viagens', icon: Map },
    { path: '/admin/galeria', label: 'Galeria', icon: Images },
    { path: '/admin/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/admin/configuracoes', label: 'Configurações', icon: Settings }
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso')
      navigate('/admin/login')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Largura da sidebar - aumentada para ter mais espaço
  const sidebarWidth = sidebarCollapsed ? 100 : 320

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-blue-950/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="text-xl font-bold gradient-text">Trilhos & Trilhas</span>
          <div className="w-10" />
        </div>
      </header>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar com espaçamento nas laterais */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-gradient-to-b from-blue-950 to-blue-900
          border-r border-white/10
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ width: isDesktop ? sidebarWidth : 320 }}
      >
        <div className="flex flex-col h-full admin-sidebar-content">

          {/* Logo */}
          <div className="pb-5 mb-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {(!sidebarCollapsed || !isDesktop) ? (
                <Link to="/admin/dashboard" className="text-2xl font-bold gradient-text">
                  Trilhos & Trilhas
                </Link>
              ) : (
                <Link to="/admin/dashboard" className="w-full flex justify-center">
                  <span className="text-2xl font-bold gradient-text">T&T</span>
                </Link>
              )}
              {/* Botão X para mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            {(!sidebarCollapsed || !isDesktop) && (
              <p className="text-white/40 text-sm mt-3 hidden lg:block">Painel Administrativo</p>
            )}
          </div>

          {/* Botão de toggle - Desktop */}
          <div className="hidden lg:flex justify-end mb-6">
            <button
              onClick={toggleSidebar}
              className="p-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {sidebarCollapsed ? <PanelLeft size={22} /> : <PanelLeftClose size={22} />}
            </button>
          </div>

          {/* Navigation - Cards maiores com mais espaçamento */}
          <nav className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              const collapsed = sidebarCollapsed && isDesktop
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center rounded-2xl transition-all duration-200
                    shadow-lg
                    ${collapsed ? 'justify-center' : ''}
                    ${active
                      ? 'bg-gradient-to-r from-cyan-500/30 to-pink-500/30 text-white border border-white/30 shadow-cyan-500/20'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
                    }
                  `}
                  style={{
                    gap: '1.25rem',
                    padding: collapsed ? '1.25rem 1rem' : '1.25rem 1.5rem'
                  }}
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={26} className={active ? 'text-cyan-400' : ''} />
                  {!collapsed && (
                    <span className="font-semibold text-lg">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-white/10" style={{ paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            {/* Card do usuário */}
            {(!sidebarCollapsed || !isDesktop) ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Logado como</p>
                    <p className="text-white text-base font-medium truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center shadow-lg" title={user?.email}>
                  <User size={24} className="text-white" />
                </div>
              </div>
            )}

            {/* Botões */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all shadow-lg ${sidebarCollapsed && isDesktop ? 'justify-center' : ''}`}
                style={{
                  gap: '1rem',
                  padding: sidebarCollapsed && isDesktop ? '1.25rem 0.75rem' : '1.25rem 1.25rem'
                }}
                title={sidebarCollapsed && isDesktop ? 'Sair da conta' : ''}
              >
                <LogOut size={22} />
                {(!sidebarCollapsed || !isDesktop) && <span className="font-semibold text-base">Sair da conta</span>}
              </button>

              <Link
                to="/"
                target="_blank"
                className={`w-full flex items-center rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-all shadow-lg ${sidebarCollapsed && isDesktop ? 'justify-center' : ''}`}
                style={{
                  gap: '1rem',
                  padding: sidebarCollapsed && isDesktop ? '1.25rem 0.75rem' : '1.25rem 1.25rem'
                }}
                title={sidebarCollapsed && isDesktop ? 'Ver site' : ''}
              >
                <ChevronLeft size={22} />
                {(!sidebarCollapsed || !isDesktop) && <span className="font-semibold text-base">Ver site</span>}
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
      >
        <div className="admin-main-content">
          <div style={{ maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
