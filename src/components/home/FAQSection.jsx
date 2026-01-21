import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'Preciso ter experiência em trilhas para participar?',
      answer: 'Não necessariamente! Oferecemos viagens para todos os níveis de experiência. Cada viagem tem uma classificação de dificuldade (Fácil, Moderada ou Difícil) para você escolher a que melhor se adequa ao seu preparo físico. Nossos guias estão sempre prontos para auxiliar iniciantes.'
    },
    {
      question: 'O que está incluso no valor da viagem?',
      answer: 'Cada viagem tem seus itens inclusos listados na descrição, mas geralmente incluem: transporte ida e volta, guia especializado, taxas de entrada em parques e, em alguns casos, equipamentos de camping. Alimentação e equipamentos pessoais normalmente não estão inclusos, a menos que especificado.'
    },
    {
      question: 'Como funciona o sistema de reservas?',
      answer: 'É muito simples! Entre em contato conosco pelo WhatsApp, escolha a viagem desejada e nosso time irá te orientar sobre disponibilidade, formas de pagamento e toda a documentação necessária. Trabalhamos com reserva mediante sinal para garantir sua vaga.'
    },
    {
      question: 'Posso cancelar minha reserva? Qual a política de reembolso?',
      answer: 'Sim, entendemos que imprevistos acontecem. Cancelamentos com mais de 15 dias de antecedência têm reembolso de 80% do valor pago. Entre 7 e 15 dias, 50%. Com menos de 7 dias, não há reembolso, mas você pode transferir sua vaga para outra pessoa ou reagendar para outra data (sujeito a disponibilidade).'
    },
    {
      question: 'Quais equipamentos preciso levar?',
      answer: 'Cada viagem tem uma lista específica de "O que levar" na descrição. Geralmente incluem: mochila, garrafa de água, protetor solar, repelente, lanterna, roupas adequadas e calçados confortáveis. Para viagens com camping, também são necessários saco de dormir e isolante térmico.'
    },
    {
      question: 'As viagens têm seguro?',
      answer: 'Sim! Todas as nossas viagens incluem seguro de acidentes pessoais. Além disso, nossos guias são certificados e treinados em primeiros socorros. A segurança dos nossos aventureiros é nossa prioridade número um.'
    },
    {
      question: 'Qual é o tamanho dos grupos?',
      answer: 'Trabalhamos com grupos pequenos e intimistas, geralmente entre 10 e 25 pessoas, dependendo da viagem. Isso garante uma experiência personalizada, maior segurança e um menor impacto ambiental nos locais visitados.'
    },
    {
      question: 'Posso levar crianças nas viagens?',
      answer: 'Depende da viagem! Algumas trilhas de dificuldade "Fácil" ou "Moderada" são adequadas para crianças acima de 8 anos, sempre acompanhadas pelos responsáveis. Entre em contato conosco para verificar qual viagem é mais adequada para sua família.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-spacing bg-blue-950">
      <div className="container-centered">

        {/* Header - TUDO BEM CENTRALIZADO */}
        <div style={{ width: '100%', maxWidth: '80rem', margin: '0 auto', textAlign: 'center', marginBottom: '5rem' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mb-6">
            <HelpCircle className="text-cyan-400" size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed" style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            Tire suas dúvidas sobre nossas viagens e serviços
          </p>
        </div>

        {/* FAQ Accordion - MAIS ESPAÇO ENTRE CARDS */}
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left transition-colors hover:bg-white/5"
                style={{ padding: '2rem 2.5rem' }}
              >
                <span className="text-white font-semibold text-lg pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  size={24}
                  className={`text-cyan-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="text-white/70 leading-relaxed" style={{ padding: '0 2.5rem 2rem 2.5rem' }}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer - MAIS ESPAÇO ACIMA */}
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <p className="text-white/60 mb-8 text-lg">
            Ainda tem dúvidas?
          </p>
          <style>{`
            @keyframes breathe-faq {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(236, 72, 153, 0.4);
              }
              50% {
                transform: scale(1.03);
                box-shadow: 0 0 50px rgba(6, 182, 212, 0.7), 0 0 90px rgba(236, 72, 153, 0.5);
              }
            }
            .btn-breathe-faq {
              animation: breathe-faq 2s ease-in-out infinite;
            }
            .btn-breathe-faq:hover {
              animation: none !important;
            }
          `}</style>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5527999999999'}?text=Olá! Tenho algumas dúvidas sobre as viagens.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-full btn-gradient btn-breathe-faq text-white font-bold transition-all"
            style={{
              padding: '1.75rem 2rem',
              fontSize: '1.25rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 0 60px rgba(6, 182, 212, 0.8), 0 0 100px rgba(236, 72, 153, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center" style={{ flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            Fale Conosco pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
