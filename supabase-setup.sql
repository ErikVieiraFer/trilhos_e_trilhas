-- =============================================
-- TRILHOS & TRILHAS - SUPABASE SETUP
-- =============================================
-- Execute este script no SQL Editor do Supabase
-- para criar todas as tabelas e configurações

-- =============================================
-- 1. TABELAS
-- =============================================

-- Tabela de viagens
CREATE TABLE IF NOT EXISTS viagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descricao TEXT NOT NULL,
  descricao_curta VARCHAR(500),
  imagem_principal TEXT NOT NULL,
  galeria TEXT[] DEFAULT '{}',
  preco DECIMAL(10,2) NOT NULL,
  preco_parcelado VARCHAR(100),
  data_viagem DATE NOT NULL,
  duracao VARCHAR(100) NOT NULL,
  dificuldade VARCHAR(50) DEFAULT 'Moderada' CHECK (dificuldade IN ('Fácil', 'Moderada', 'Difícil', 'Extrema')),
  vagas_total INTEGER NOT NULL DEFAULT 20,
  vagas_disponiveis INTEGER NOT NULL DEFAULT 20,
  local_saida VARCHAR(255),
  destino VARCHAR(255) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  inclusos TEXT[] DEFAULT '{}',
  nao_inclusos TEXT[] DEFAULT '{}',
  o_que_levar TEXT[] DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do site
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de galeria geral (momentos/fotos de clientes)
CREATE TABLE IF NOT EXISTS galeria_momentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imagem_url TEXT NOT NULL,
  legenda VARCHAR(255),
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de FAQ
CREATE TABLE IF NOT EXISTS faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- =============================================
-- 2. ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_viagens_ativo ON viagens(ativo);
CREATE INDEX IF NOT EXISTS idx_viagens_destaque ON viagens(destaque);
CREATE INDEX IF NOT EXISTS idx_viagens_data ON viagens(data_viagem);
CREATE INDEX IF NOT EXISTS idx_viagens_ordem ON viagens(ordem);

-- =============================================
-- 3. TRIGGER PARA UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS viagens_updated_at ON viagens;
CREATE TRIGGER viagens_updated_at
  BEFORE UPDATE ON viagens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS configuracoes_updated_at ON configuracoes;
CREATE TRIGGER configuracoes_updated_at
  BEFORE UPDATE ON configuracoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE viagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria_momentos ENABLE ROW LEVEL SECURITY;

-- Políticas para VIAGENS
DROP POLICY IF EXISTS "Viagens ativas são públicas" ON viagens;
CREATE POLICY "Viagens ativas são públicas" ON viagens
  FOR SELECT USING (ativo = true);

DROP POLICY IF EXISTS "Admin pode tudo em viagens" ON viagens;
CREATE POLICY "Admin pode tudo em viagens" ON viagens
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para CONFIGURAÇÕES
DROP POLICY IF EXISTS "Configurações são públicas para leitura" ON configuracoes;
CREATE POLICY "Configurações são públicas para leitura" ON configuracoes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin pode editar configurações" ON configuracoes;
CREATE POLICY "Admin pode editar configurações" ON configuracoes
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para GALERIA
DROP POLICY IF EXISTS "Galeria ativa é pública" ON galeria_momentos;
CREATE POLICY "Galeria ativa é pública" ON galeria_momentos
  FOR SELECT USING (ativo = true);

DROP POLICY IF EXISTS "Admin pode tudo na galeria" ON galeria_momentos;
CREATE POLICY "Admin pode tudo na galeria" ON galeria_momentos
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para FAQ
DROP POLICY IF EXISTS "FAQ é público" ON faq;
CREATE POLICY "FAQ é público" ON faq
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin pode gerenciar FAQ" ON faq;
CREATE POLICY "Admin pode gerenciar FAQ" ON faq
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 5. STORAGE BUCKETS
-- =============================================

-- Criar bucket para imagens de viagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('viagens', 'viagens', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para galeria de momentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('galeria', 'galeria', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 6. STORAGE POLICIES
-- =============================================

-- Leitura pública das imagens
DROP POLICY IF EXISTS "Imagens de viagens são públicas" ON storage.objects;
CREATE POLICY "Imagens de viagens são públicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'viagens');

DROP POLICY IF EXISTS "Imagens da galeria são públicas" ON storage.objects;
CREATE POLICY "Imagens da galeria são públicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'galeria');

-- Upload apenas para autenticados
DROP POLICY IF EXISTS "Admin pode fazer upload em viagens" ON storage.objects;
CREATE POLICY "Admin pode fazer upload em viagens" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'viagens'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Admin pode fazer upload na galeria" ON storage.objects;
CREATE POLICY "Admin pode fazer upload na galeria" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'galeria'
    AND auth.role() = 'authenticated'
  );

-- Delete apenas para autenticados
DROP POLICY IF EXISTS "Admin pode deletar de viagens" ON storage.objects;
CREATE POLICY "Admin pode deletar de viagens" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'viagens'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Admin pode deletar da galeria" ON storage.objects;
CREATE POLICY "Admin pode deletar da galeria" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'galeria'
    AND auth.role() = 'authenticated'
  );

-- =============================================
-- 7. DADOS DE EXEMPLO (SEED)
-- =============================================

-- Configurações iniciais
INSERT INTO configuracoes (chave, valor) VALUES
  ('whatsapp', '5527999999999'),
  ('email', 'contato@trilhosetrilhas.com.br'),
  ('instagram', 'https://instagram.com/trilhosetrilhases'),
  ('sobre_texto', 'Somos uma empresa de turismo de aventura do Espírito Santo, especializada em trilhas, viagens a praias, campings e expedições noturnas. Atuamos nos estados ES, RJ, MG e BA, proporcionando experiências únicas em meio à natureza.'),
  ('num_aventureiros', '500'),
  ('num_trilhas', '50'),
  ('num_estados', '4')
ON CONFLICT (chave) DO NOTHING;

-- Viagens de exemplo
INSERT INTO viagens (
  titulo, slug, descricao, descricao_curta, imagem_principal,
  preco, preco_parcelado, data_viagem, duracao, dificuldade,
  vagas_total, vagas_disponiveis, local_saida, destino, estado,
  inclusos, nao_inclusos, o_que_levar, ativo, destaque, ordem
) VALUES
(
  'Pico da Bandeira',
  'pico-da-bandeira',
  'O Pico da Bandeira é o terceiro ponto mais alto do Brasil, com 2.892 metros de altitude. Uma experiência única de contemplar o nascer do sol acima das nuvens, em uma trilha desafiadora que recompensa com vistas espetaculares do Parque Nacional do Caparaó. A aventura inclui travessia noturna para chegar ao cume no momento exato do amanhecer.',
  'Conquiste o terceiro ponto mais alto do Brasil e contemple o nascer do sol acima das nuvens',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920',
  650.00,
  'ou 12x de R$ 54,17',
  '2025-03-15',
  '2 dias e 1 noite',
  'Difícil',
  20,
  8,
  'Shopping Vitória - ES',
  'Parque Nacional do Caparaó',
  'MG',
  ARRAY['Transporte ida e volta em van executiva', 'Guia especializado', 'Taxa de entrada no parque', 'Camping com estrutura', 'Café da manhã'],
  ARRAY['Alimentação (almoço e jantar)', 'Equipamento pessoal', 'Seguro viagem (opcional)'],
  ARRAY['Mochila de ataque (30-40L)', 'Saco de dormir (-5°C)', 'Lanterna de cabeça', 'Agasalho para frio intenso', 'Botas de trilha', 'Garrafa de água (2L)'],
  true,
  true,
  0
),
(
  'Pedra Azul',
  'pedra-azul',
  'A Pedra Azul é um dos cartões postais do Espírito Santo. Uma formação rochosa impressionante que muda de cor conforme a luz do sol, oferecendo trilhas para todos os níveis e paisagens deslumbrantes da Mata Atlântica preservada. Trilha leve até as piscinas naturais e opção de trilha mais desafiadora até o mirante.',
  'Descubra a beleza do cartão postal capixaba',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920',
  180.00,
  'ou 6x de R$ 30,00',
  '2025-02-22',
  '1 dia (saída às 6h, retorno às 18h)',
  'Moderada',
  25,
  15,
  'Shopping Vitória - ES',
  'Parque Estadual da Pedra Azul',
  'ES',
  ARRAY['Transporte ida e volta', 'Guia especializado', 'Taxa de entrada no parque'],
  ARRAY['Alimentação', 'Equipamentos pessoais'],
  ARRAY['Tênis de trilha', 'Protetor solar', 'Repelente', 'Água (1,5L)', 'Lanche leve', 'Roupa de banho'],
  true,
  false,
  1
),
(
  'Camping Caparaó',
  'camping-caparao',
  'Uma experiência completa de camping no Parque Nacional do Caparaó, com noites sob as estrelas, trilhas pela mata atlântica e a oportunidade de contemplar paisagens únicas. Ideal para quem busca desconectar e viver a natureza intensamente. Inclui trilha até cachoeiras e observação de estrelas.',
  'Desconecte-se sob as estrelas do Caparaó',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920',
  450.00,
  'ou 10x de R$ 45,00',
  '2025-04-05',
  '3 dias e 2 noites',
  'Moderada',
  15,
  5,
  'Shopping Vitória - ES',
  'Parque Nacional do Caparaó',
  'ES',
  ARRAY['Transporte ida e volta', 'Guia especializado', 'Barraca compartilhada', 'Taxa de entrada no parque', 'Kit camping (fogareiro, panelas)'],
  ARRAY['Alimentação', 'Saco de dormir', 'Isolante térmico'],
  ARRAY['Saco de dormir', 'Isolante térmico', 'Lanterna', 'Roupas de frio', 'Itens de higiene pessoal', 'Alimentos liofilizados ou enlatados'],
  true,
  false,
  2
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- PRONTO! Execute este script no Supabase
-- =============================================
