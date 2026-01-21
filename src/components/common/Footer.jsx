import { Link } from 'react-router-dom'
import { Instagram, Phone, MapPin, Mail, FileText, HelpCircle, Shield } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/trilhosetrilhases'

  return (
    <footer className="bg-blue-950 border-t border-white/10">
      <div className="container-centered py-24 md:py-28">

        {/* Grid com 4 colunas - gap aumentado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-20">

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
            <h3 className="text-white font-semibold text-xl mb-10">Navegação</h3>
            <ul className="space-y-6">
              <li>
                <a href="#viagens" className="text-white/60 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  Viagens
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-white/60 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#galeria" className="text-white/60 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#contato" className="text-white/60 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Informações */}
          <div>
            <h3 className="text-white font-semibold text-xl mb-10">Informações</h3>
            <ul className="space-y-6">
              <li>
                <a
                  href="#faq"
                  className="text-white/60 hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <HelpCircle size={18} className="text-cyan-400" />
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  className="text-white/60 hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <Phone size={18} className="text-green-400" />
                  Entre em Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-white font-semibold text-xl mb-10">Fale Conosco</h3>
            <ul className="space-y-6">
              <li>
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-green-400 transition-colors group"
                >
                  <Phone size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-pink-400 transition-colors group"
                >
                  <Instagram size={20} className="text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>@trilhosetrilhases</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <MapPin size={20} className="text-cyan-400" />
                <span>Espírito Santo, BR</span>
              </li>
            </ul>

            {/* Badges de Estados */}
            <div className="mt-6">
              <p className="text-white/40 text-sm mb-3">Atuamos em:</p>
              <div className="flex flex-wrap gap-2">
                {['ES', 'RJ', 'MG', 'BA'].map((estado) => (
                  <span
                    key={estado}
                    className="px-3 py-1 rounded-full bg-white/10 text-white/70 font-semibold text-sm hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 hover:text-white transition-all cursor-default"
                  >
                    {estado}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar com MUITO mais espaço */}
        <div className="mt-24 pt-12 pb-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
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
