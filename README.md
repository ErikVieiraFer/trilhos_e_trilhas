# Trilhos & Trilhas

Site fullstack para a empresa **Trilhos & Trilhas** - turismo de aventura do Espírito Santo que organiza trilhas, viagens a praias, campings e expedições noturnas nos estados ES, RJ, MG e BA.

Instagram: [@trilhosetrilhases](https://instagram.com/trilhosetrilhases)

## Tecnologias

### Frontend
- React 18 + Vite
- Tailwind CSS
- Swiper.js (carrossel)
- Lucide React (ícones)
- React Router DOM
- React Hot Toast (notificações)

### Backend/Infraestrutura
- Supabase (PostgreSQL + Storage + Auth)
- Hospedagem: Vercel/Netlify

## Funcionalidades

### Site Público
- Hero carrossel fullscreen com viagens em destaque
- Detalhes das viagens com informações completas
- Seção "Sobre Nós" com estatísticas
- Galeria de momentos com lightbox
- Botão flutuante do WhatsApp
- Design responsivo mobile-first
- SEO otimizado

### Painel Administrativo (/admin)
- Login seguro com Supabase Auth
- Dashboard com estatísticas
- CRUD completo de viagens
- Gerenciamento de galeria de fotos
- Configurações do site
- Upload de imagens com preview

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase (gratuito)

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd trilhos-trilhas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. No SQL Editor, execute o script `supabase-setup.sql` incluído no projeto
3. Crie um usuário admin em Authentication > Users > Add User

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_WHATSAPP_NUMBER=5527999999999
VITE_INSTAGRAM_URL=https://instagram.com/trilhosetrilhases
VITE_SITE_URL=https://trilhosetrilhas.com.br
```

### 5. Execute o projeto

```bash
npm run dev
```

O site estará disponível em `http://localhost:5173`

## Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera a build de produção
npm run preview  # Preview da build de produção
npm run lint     # Executa o ESLint
```

## Estrutura do Projeto

```
trilhos-trilhas/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/          # Componentes do painel admin
│   │   ├── common/         # Componentes compartilhados
│   │   └── home/           # Componentes da página inicial
│   ├── contexts/
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── hooks/              # Hooks customizados
│   │   ├── useViagens.js
│   │   ├── useGaleria.js
│   │   ├── useStorage.js
│   │   └── useConfiguracoes.js
│   ├── lib/
│   │   ├── supabase.js     # Cliente Supabase
│   │   └── utils.js        # Funções utilitárias
│   ├── pages/
│   │   ├── admin/          # Páginas do painel admin
│   │   └── Home.jsx        # Página inicial
│   ├── styles/
│   │   └── globals.css     # Estilos globais + Tailwind
│   ├── App.jsx             # Componente raiz com rotas
│   └── main.jsx            # Entry point
├── .env.example
├── index.html
├── supabase-setup.sql      # Script de setup do banco
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Configuração do Supabase

O arquivo `supabase-setup.sql` contém:

1. **Tabelas**: viagens, configuracoes, galeria_momentos
2. **Índices**: Para otimização de queries
3. **Triggers**: Para atualização automática de timestamps
4. **RLS (Row Level Security)**: Políticas de segurança
5. **Storage Buckets**: Para upload de imagens
6. **Dados de exemplo**: 3 viagens e configurações iniciais

### Criando o Usuário Admin

1. Acesse o painel do Supabase
2. Vá em Authentication > Users
3. Clique em "Add User"
4. Preencha email e senha
5. Use essas credenciais para acessar `/admin/login`

## Deploy

### Vercel

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify

1. Conecte o repositório ao Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure as variáveis de ambiente

## Paleta de Cores

```css
/* Azul Ciano */
--cyan-400: #22d3ee;
--cyan-500: #06b6d4;
--cyan-600: #0891b2;

/* Rosa/Magenta */
--pink-400: #f472b6;
--pink-500: #ec4899;
--pink-600: #db2777;

/* Azul Escuro/Marinho */
--blue-800: #1e3a5f;
--blue-900: #0f172a;
--blue-950: #020617;
```

## Rotas

### Públicas
- `/` - Página inicial

### Admin (autenticado)
- `/admin/login` - Login
- `/admin/dashboard` - Dashboard
- `/admin/viagens` - Lista de viagens
- `/admin/viagens/nova` - Nova viagem
- `/admin/viagens/:id/editar` - Editar viagem
- `/admin/galeria` - Gerenciar galeria
- `/admin/configuracoes` - Configurações do site

## Licença

Todos os direitos reservados - Trilhos & Trilhas
# trilhos_e_trilhas
