import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/trilhosetrilhases'

  return (
    <footer id="contato" className="bg-blue-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold gradient-text">
                Trilhos & Trilhas
              </span>
            </Link>
            <p className="mt-4 text-white/60 max-w-md">
              Sua próxima aventura começa aqui. Trilhas, praias, campings e expedições
              noturnas nos estados ES, RJ, MG e BA.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={getWhatsAppLink(whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
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

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60">
                <Phone size={16} className="text-cyan-400" />
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <Instagram size={16} className="text-pink-400" />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors"
                >
                  @trilhosetrilhases
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <MapPin size={16} className="text-cyan-400" />
                <span>Espírito Santo, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} Trilhos & Trilhas. Todos os direitos reservados.
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
