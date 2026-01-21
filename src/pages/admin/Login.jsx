import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Eye, EyeOff, AlertCircle, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      await signIn(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos')
      } else {
        setError('Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo Card */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Trilhos & Trilhas</h1>
          <p className="text-white/50 text-lg">Painel Administrativo</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border-b border-white/10" style={{ padding: '2rem 2.5rem' }}>
            <h2 className="text-2xl font-bold text-white text-center">Entrar</h2>
          </div>

          {/* Card Body */}
          <div style={{ padding: '2.5rem' }}>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Field */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-3">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none transition-all"
                    style={{ paddingLeft: '3.5rem', paddingRight: '1rem', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-3">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none transition-all"
                    style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient rounded-xl text-white font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                style={{ padding: '1.5rem', fontSize: '1.125rem', marginTop: '2rem' }}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={24} />
                    Entrar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back to Site Link */}
        <Link
          to="/"
          className="flex items-center justify-center gap-3 text-white/60 hover:text-cyan-400 transition-colors font-medium"
          style={{ marginTop: '2rem', padding: '1rem', fontSize: '1rem' }}
        >
          <ArrowLeft size={20} />
          Voltar ao site
        </Link>
      </div>
    </div>
  )
}

export default Login
