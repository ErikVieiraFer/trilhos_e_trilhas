import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-blue-950 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold gradient-text">Trilhos & Trilhas</Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Proporcionando experiências únicas de ecoturismo e aventura. Conecte-se com a natureza e viva momentos inesquecíveis.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Navegação</h3>
            <ul className="space-y-3">
              <li><a href="#viagens" className="text-white/60 hover:text-cyan-400 transition-colors">Viagens</a></li>
              <li><a href="#sobre" className="text-white/60 hover:text-cyan-400 transition-colors">Sobre Nós</a></li>
              <li><a href="#galeria" className="text-white/60 hover:text-cyan-400 transition-colors">Galeria</a></li>
              <li><a href="#faq" className="text-white/60 hover:text-cyan-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-green-400 transition-colors">
                  <Phone size={18} />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM_USER || 'trilhosetrilhases'}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-pink-400 transition-colors">
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="mailto:contato@trilhosetrilhas.com.br" className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors">
                  <Mail size={18} />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/40 text-sm">© {currentYear} Trilhos & Trilhas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer