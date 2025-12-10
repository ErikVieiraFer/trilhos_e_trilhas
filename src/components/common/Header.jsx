import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { getWhatsAppLink } from '../../lib/utils'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const navLinks = [
    { href: '#viagens', label: 'Viagens' },
    { href: '#sobre', label: 'Sobre' },
    { href: '#galeria', label: 'Galeria' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contato', label: 'Contato' }
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-blue-950/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-centered">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">
              Trilhos & Trilhas
            </span>
          </Link>

          {/* Desktop Navigation - Centered with spacing */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-white/80 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <a
              href={getWhatsAppLink(import.meta.env.VITE_WHATSAPP_NUMBER, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-6 btn-gradient px-8 py-3 rounded-full text-white font-bold text-base transition-all"
              style={{
                boxShadow: '0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(236, 72, 153, 0.4)'
              }}
            >
              Fale Conosco
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-80' : 'max-h-0'
        }`}
      >
        <nav className="px-4 pb-6 space-y-4 bg-blue-950/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block text-white/80 hover:text-white transition-colors font-medium py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href={getWhatsAppLink(import.meta.env.VITE_WHATSAPP_NUMBER, 'Olá! Vim pelo site e gostaria de saber mais sobre as viagens.')}
            target="_blank"
            rel="noopener noreferrer"
            className="block btn-gradient px-6 py-3 rounded-full text-white font-semibold text-center mt-4"
          >
            Fale Conosco
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
