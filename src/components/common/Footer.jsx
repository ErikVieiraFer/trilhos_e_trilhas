import { Link } from 'react-router-dom'
import { Instagram, Phone, MapPin } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/trilhosetrilhases'

  return (
    <footer className="bg-blue-950 border-t border-white/10">
      <div className="container-centered py-20 md:py-24">

        {/* Grid com 4 colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Coluna 1 - Logo e descrição */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold gradient-text">
                Trilhos & Trilhas
              </span>
            </Link>
            <p className="text-white/60 mb-8 leading-relaxed">
              Sua próxima aventura começa aqui. Trilhas, praias, campings e expedições noturnas.
            </p>
            <div className="flex items-center gap-4">
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
            <h3 className="text-white font-semibold text-lg mb-8">Links Rápidos</h3>
            <ul className="space-y-5">
              <li>
                <a href="#viagens" className="text-white/60 hover:text-cyan-400 transition-colors text-lg">
                  Viagens
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-white/60 hover:text-cyan-400 transition-colors text-lg">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#galeria" className="text-white/60 hover:text-cyan-400 transition-colors text-lg">
                  Galeria
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-cyan-400 transition-colors text-lg"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-8">Contato</h3>
            <ul className="space-y-5">
              <li>
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors text-lg"
                >
                  <Phone size={20} className="text-cyan-400" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-pink-400 transition-colors text-lg"
                >
                  <Instagram size={20} className="text-pink-400" />
                  @trilhosetrilhases
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-lg">
                <MapPin size={20} className="text-cyan-400" />
                Espírito Santo, Brasil
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Atuação */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-8">Atuação</h3>
            <p className="text-white/60 mb-6 text-lg">
              Turismo de aventura nos estados:
            </p>
            <div className="flex flex-wrap gap-3">
              {['ES', 'RJ', 'MG', 'BA'].map((estado) => (
                <span
                  key={estado}
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white font-semibold text-base hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 transition-all cursor-default"
                >
                  {estado}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar com mais espaço */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-base text-center md:text-left">
            © {currentYear} Trilhos & Trilhas. Todos os direitos reservados.
          </p>
          <p className="text-white/40 text-base text-center md:text-right">
            Turismo de aventura ES, RJ, MG e BA
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
