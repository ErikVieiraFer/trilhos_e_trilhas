import { Link } from 'react-router-dom'
import { Instagram, Phone, MapPin } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/trilhosetrilhases'

  return (
    <footer className="bg-blue-950 border-t border-white/10">
      <div className="container-centered py-16 md:py-20">

        {/* Grid com 4 colunas bem distribuídas e centralizadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">

          {/* Coluna 1 - Logo e descrição */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold gradient-text">
                Trilhos & Trilhas
              </span>
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed">
              Sua próxima aventura começa aqui. Trilhas, praias, campings e expedições noturnas.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href={getWhatsAppLink(whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone size={22} />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
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
                <a
                  href={getWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-cyan-400 transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors"
                >
                  <Phone size={18} className="text-cyan-400" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-pink-400 transition-colors"
                >
                  <Instagram size={18} className="text-pink-400" />
                  @trilhosetrilhases
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <MapPin size={18} className="text-cyan-400" />
                Espírito Santo, Brasil
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Atuação */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Atuação</h3>
            <p className="text-white/60 mb-4">
              Turismo de aventura nos estados:
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {['ES', 'RJ', 'MG', 'BA'].map((estado) => (
                <span
                  key={estado}
                  className="px-4 py-2 rounded-full bg-white/10 text-white font-medium text-sm"
                >
                  {estado}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {currentYear} Trilhos & Trilhas. Todos os direitos reservados.
          </p>
          <p className="text-white/40 text-sm text-center md:text-right">
            Turismo de aventura ES, RJ, MG e BA
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
