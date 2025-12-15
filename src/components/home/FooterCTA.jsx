import { useState, useEffect, useRef } from 'react'
import { MessageCircle, ArrowRight, Mail, CheckCircle } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const FooterCTA = ({ config }) => {
  const sectionRef = useRef(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        // Move a imagem suavemente para cima enquanto o usuário rola para baixo
        setOffsetY((rect.top - window.innerHeight) * 0.15)
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Cálculo inicial
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappNumber = config?.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const backgroundImage = config?.footer_imagem || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920'

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    // Aqui você pode adicionar integração com serviço de email marketing
    // Por enquanto, simulamos o sucesso
    setTimeout(() => {
      setSubscribed(true)
      setLoading(false)
      setEmail('')
    }, 1000)
  }

  return (
    <section ref={sectionRef} id="contato" className="relative section-cta pt-32 pb-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-[130%] top-0 bg-cover bg-center pointer-events-none will-change-transform"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${offsetY}px)`
        }}
      >
        <div className="absolute inset-0 bg-blue-950/70" />
      </div>

      {/* Gradiente de transição superior - FAQ → Contato */}
      <div 
        className="absolute inset-x-0 top-0 h-32 md:h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgb(23, 37, 84) 0%, transparent 100%)'
        }}
      />

      {/* Gradiente de transição inferior - Contato → Footer */}
      <div 
        className="absolute inset-x-0 bottom-0 h-32 md:h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, rgb(23, 37, 84) 0%, transparent 100%)'
        }}
      />

      {/* Content - TUDO BEM CENTRALIZADO */}
      <div className="relative z-10 container-centered">
        <div style={{ width: '100%', maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          {/* Main Title - MUITO MAIOR */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Pronto para sua próxima{' '}
            <span className="gradient-text block mt-2">aventura?</span>
          </h2>

          {/* Subtitle - BEM CENTRALIZADO */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed" style={{ maxWidth: '48rem', margin: '0 auto 3.5rem auto', textAlign: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            Entre em contato conosco e reserve seu lugar na próxima expedição.
            Estamos prontos para te levar em uma jornada inesquecível!
          </p>

          {/* WhatsApp Button - SUPER CHAMATIVO */}
          <style>{`
            @keyframes breathe-cta {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(236, 72, 153, 0.4);
              }
              50% {
                transform: scale(1.03);
                box-shadow: 0 0 50px rgba(6, 182, 212, 0.7), 0 0 90px rgba(236, 72, 153, 0.5);
              }
            }
            .btn-breathe-cta {
              animation: breathe-cta 2s ease-in-out infinite;
            }
            .btn-breathe-cta:hover {
              animation: none !important;
            }
          `}</style>
          <a
            href={getWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 btn-gradient btn-breathe-cta rounded-full text-white font-bold transition-all"
            style={{
              padding: '1.75rem 3rem',
              fontSize: '1.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)'
              e.currentTarget.style.boxShadow = '0 0 60px rgba(6, 182, 212, 0.8), 0 0 100px rgba(236, 72, 153, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            Falar no WhatsApp
            <ArrowRight size={32} />
          </a>

          {/* Newsletter - BEM CENTRALIZADO E MAIS ESPAÇO */}
          <div style={{ marginTop: '5rem', maxWidth: '36rem', margin: '5rem auto 0 auto' }}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="text-cyan-400" size={28} />
              <h3 className="text-2xl font-bold text-white text-center">
                Receba Nossas Aventuras
              </h3>
            </div>
            <p className="text-white/70 text-center mb-8">
              Cadastre-se e seja o primeiro a saber sobre novas viagens e promoções exclusivas
            </p>

            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-full text-white placeholder-white/40 focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none transition-all text-center"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 whitespace-nowrap shadow-lg shadow-pink-500/20"
                >
                  {loading ? 'Enviando...' : 'Quero Saber Mais'}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4 text-green-400">
                <CheckCircle size={24} />
                <span className="font-semibold">Inscrição realizada com sucesso!</span>
              </div>
            )}

            <p className="text-white/40 text-xs text-center mt-4 flex items-center justify-center gap-2">
              🔒 Sua privacidade está segura. Sem spam, apenas aventuras!
            </p>
          </div>
        </div>

          {/* Trust indicators - BEM CENTRALIZADO */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-white/60 text-lg">
          <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Resposta rápida</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/5">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>Pagamento facilitado</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/5">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
            <span>Grupos pequenos</span>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

export default FooterCTA
