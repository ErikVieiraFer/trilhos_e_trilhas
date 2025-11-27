import { Link } from 'react-router-dom'
import { Instagram, Phone, MapPin } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/trilhosetrilhases'

  return (
    <footer className="bg-blue-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1 - Logo e descrição */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold gradient-text mb-4">Trilhos & Trilhas</h3>
            <p className="text-white/60 mb-6">
              Sua próxima aventura começa aqui. Trilhas, praias, campings e expedições noturnas nos estados ES, RJ, MG e BA.
            </p>
            <div className="flex gap-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href={getWhatsAppLink(whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#viagens" className="text-white/60 hover:text-cyan-400 transition-colors">
                  Viagens
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-white/60 hover:text-cyan-400 transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#galeria" className="text-white/60 hover:text-cyan-400 transition-colors">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#contato" className="text-white/60 hover:text-cyan-400 transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/60">
                <Phone size={18} className="text-cyan-400" />
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Instagram size={18} className="text-pink-400" />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors"
                >
                  @trilhosetrilhases
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <MapPin size={18} className="text-cyan-400" />
                <span>Espírito Santo, Brasil</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Atuação */}
          <div>
            <h4 className="text-white font-semibold mb-6">Atuação</h4>
            <p className="text-white/60">
              Turismo de aventura nos estados:
            </p>
            <p className="text-white font-medium mt-2">
              ES • RJ • MG • BA
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-white/40 text-sm">
            © {currentYear} Trilhos & Trilhas. Todos os direitos reservados.
          </p>
          <p className="text-white/40 text-sm">
            Turismo de aventura ES, RJ, MG e BA
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
