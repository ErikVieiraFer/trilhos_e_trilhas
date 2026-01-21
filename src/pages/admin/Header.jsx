import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Viagens', path: '/#viagens' },
    { name: 'Sobre Nós', path: '/#sobre' },
    { name: 'Galeria', path: '/#galeria' },
    { name: 'FAQ', path: '/#faq' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen ? 'bg-blue-950/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 z-50 relative">
          Trilhos & Trilhas
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="text-sm font-medium text-white/80 hover:text-white transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a 
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-gradient px-6 py-2 rounded-full text-white font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 z-50 relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Overlay */}
        <div className={`fixed inset-0 bg-blue-950 z-40 transition-transform duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
            {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="text-3xl font-bold text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a 
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-gradient px-8 py-3 rounded-full text-white font-bold text-lg flex items-center gap-2 mt-4"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header