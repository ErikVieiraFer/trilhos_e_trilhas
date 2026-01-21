import { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import SEO from '../components/common/SEO'
import HeroCarousel from '../components/home/HeroCarousel'
import ViagemDetails from '../components/home/ViagemDetails'
import SobreSection from '../components/home/SobreSection'
import GaleriaMomentos from '../components/home/GaleriaMomentos'
import FAQSection from '../components/home/FAQSection'
import FooterCTA from '../components/home/FooterCTA'
import Skeleton, { CardSkeleton } from '../components/common/Skeleton'
import { useViagens } from '../hooks/useViagens'
import { useGaleria } from '../hooks/useGaleria'
import { useConfiguracoes } from '../hooks/useConfiguracoes'

// Demo data for when Supabase is not configured
const demoViagens = [
  {
    id: '1',
    titulo: 'Pico da Bandeira',
    slug: 'pico-da-bandeira',
    descricao: 'O Pico da Bandeira é o terceiro ponto mais alto do Brasil, com 2.892 metros de altitude. Uma experiência única de contemplar o nascer do sol acima das nuvens, em uma trilha desafiadora que recompensa com vistas espetaculares do Parque Nacional do Caparaó.',
    descricao_curta: 'Conquiste o terceiro ponto mais alto do Brasil',
    imagem_principal: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920',
    galeria: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800'
    ],
    preco: 650,
    preco_parcelado: 'ou 12x de R$ 54,17',
    data_viagem: '2025-03-15',
    duracao: '2 dias e 1 noite',
    dificuldade: 'Difícil',
    vagas_total: 20,
    vagas_disponiveis: 8,
    local_saida: 'Shopping Vitória',
    destino: 'Parque Nacional do Caparaó',
    estado: 'MG',
    inclusos: ['Transporte ida e volta', 'Guia especializado', 'Taxa de entrada no parque', 'Camping'],
    nao_inclusos: ['Alimentação', 'Equipamento pessoal'],
    o_que_levar: ['Mochila de ataque', 'Saco de dormir', 'Lanterna', 'Agasalho']
  },
  {
    id: '2',
    titulo: 'Pedra Azul',
    slug: 'pedra-azul',
    descricao: 'A Pedra Azul é um dos cartões postais do Espírito Santo. Uma formação rochosa impressionante que muda de cor conforme a luz do sol, oferecendo trilhas para todos os níveis e paisagens deslumbrantes da Mata Atlântica preservada.',
    descricao_curta: 'Descubra a beleza do cartão postal capixaba',
    imagem_principal: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920',
    galeria: [],
    preco: 180,
    preco_parcelado: 'ou 6x de R$ 30,00',
    data_viagem: '2025-02-22',
    duracao: '1 dia',
    dificuldade: 'Moderada',
    vagas_total: 25,
    vagas_disponiveis: 15,
    local_saida: 'Shopping Vitória',
    destino: 'Parque Estadual da Pedra Azul',
    estado: 'ES',
    inclusos: ['Transporte ida e volta', 'Guia especializado', 'Taxa de entrada'],
    nao_inclusos: ['Alimentação'],
    o_que_levar: ['Tênis de trilha', 'Protetor solar', 'Água']
  },
  {
    id: '3',
    titulo: 'Camping Caparaó',
    slug: 'camping-caparao',
    descricao: 'Uma experiência completa de camping no Parque Nacional do Caparaó, com noites sob as estrelas, trilhas pela mata atlântica e a oportunidade de contemplar paisagens únicas. Ideal para quem busca desconectar e viver a natureza intensamente.',
    descricao_curta: 'Desconecte-se sob as estrelas do Caparaó',
    imagem_principal: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920',
    galeria: [],
    preco: 450,
    preco_parcelado: 'ou 10x de R$ 45,00',
    data_viagem: '2025-04-05',
    duracao: '3 dias e 2 noites',
    dificuldade: 'Moderada',
    vagas_total: 15,
    vagas_disponiveis: 5,
    local_saida: 'Shopping Vitória',
    destino: 'Parque Nacional do Caparaó',
    estado: 'ES',
    inclusos: ['Transporte', 'Guia', 'Barraca', 'Taxa de entrada'],
    nao_inclusos: ['Alimentação', 'Saco de dormir'],
    o_que_levar: ['Saco de dormir', 'Isolante térmico', 'Lanterna', 'Roupas de frio']
  }
]

const demoGaleria = [
  { id: '1', imagem_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', legenda: 'Trilha ao amanhecer' },
  { id: '2', imagem_url: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800', legenda: 'Camping nas montanhas' },
  { id: '3', imagem_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', legenda: 'Noite estrelada' },
  { id: '4', imagem_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800', legenda: 'Vista do topo' },
  { id: '5', imagem_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', legenda: 'Pico da Bandeira' },
  { id: '6', imagem_url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800', legenda: 'Grupo de aventureiros' }
]

const Home = () => {
  const [activeViagemIndex, setActiveViagemIndex] = useState(0)
  const { viagens, loading: viagensLoading } = useViagens()
  const { fotos, loading: galeriaLoading } = useGaleria()
  const { config, loading: configLoading } = useConfiguracoes()

  // Use demo data if no data from Supabase
  const displayViagens = viagens.length > 0 ? viagens : demoViagens
  const displayFotos = fotos.length > 0 ? fotos : demoGaleria

  const loading = viagensLoading && configLoading

  return (
    <>
      <SEO 
        title="Home" 
        description={config?.sobre_texto?.substring(0, 160)} 
      />
      <Header />

      <main>
        {/* Hero Carousel */}
        {loading ? (
          <div className="h-screen min-h-[600px] w-full bg-blue-950 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <HeroCarousel
            viagens={displayViagens}
            onSlideChange={setActiveViagemIndex}
            activeIndex={activeViagemIndex}
          />
        )}

        {/* Viagem Details */}
        {loading ? (
          <div className="container mx-auto px-4 py-20">
            <CardSkeleton />
          </div>
        ) : displayViagens.length > 0 && (
          <ViagemDetails
            viagens={displayViagens}
            activeIndex={activeViagemIndex}
            onIndexChange={setActiveViagemIndex}
          />
        )}

        {/* Sobre Section */}
        <SobreSection config={config} />

        {/* Galeria de Momentos */}
        <GaleriaMomentos fotos={displayFotos} loading={galeriaLoading} />

        {/* FAQ Section */}
        <FAQSection />

        {/* Footer CTA */}
        <FooterCTA config={config} />
      </main>

      <Footer />
    </>
  )
}

export default Home
