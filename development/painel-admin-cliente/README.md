# Painel Admin Cliente - Vitrine Virtual

Painel administrativo completo em Next.js 15 para gerenciamento de serviços, horários e agendamentos do sistema Vitrine Virtual.

## Visão Geral

Este painel permite que clientes (barbeiros, salões, dentistas, etc.) gerenciem seus negócios através de uma interface web moderna e responsiva.

### Funcionalidades

- **Autenticação**: Login e registro com Firebase Authentication
- **Dashboard**: Métricas em tempo real (serviços, agendamentos, status)
- **Gerenciamento de Serviços**: CRUD completo com upload de imagens
- **Configuração de Horários**: Grid semanal de disponibilidade
- **Visualização de Agendamentos**: Tabela com filtros por data e status
- **Personalização**: Cores, logo e fonte customizáveis (white-label)
- **Perfil da Empresa**: Gerenciamento de dados e link do site

## Stack Tecnológica

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes)
- **Firebase** (Authentication, Firestore, Storage)
- **React Hook Form + Zod** (validações)
- **Lucide React** (ícones)
- **date-fns** (manipulação de datas)

## Pré-requisitos

- Node.js 18+ e npm
- Projeto Firebase configurado
- Firestore habilitado
- Firebase Storage habilitado
- Firebase Authentication habilitado (Email/Password)

## Instalação

### 1. Clone o repositório ou navegue até a pasta

```bash
cd painel-admin-cliente
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` e preencha com suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 4. Execute o projeto em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Build para Produção

```bash
npm run build
npm start
```

## Estrutura do Projeto

```
painel-admin-cliente/
├── src/
│   ├── app/                    # Páginas e rotas (App Router)
│   │   ├── (auth)/            # Grupo de rotas de autenticação
│   │   │   ├── login/         # Página de login
│   │   │   └── register/      # Página de registro
│   │   ├── (dashboard)/       # Grupo de rotas do dashboard
│   │   │   ├── layout.tsx     # Layout com sidebar e header
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── services/      # CRUD de serviços
│   │   │   ├── availability/  # Configuração de horários
│   │   │   ├── bookings/      # Lista de agendamentos
│   │   │   ├── theme/         # Personalização
│   │   │   └── profile/       # Perfil da empresa
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── globals.css        # Estilos globais
│   │   └── page.tsx           # Redirecionamento inicial
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes shadcn/ui
│   │   ├── sidebar.tsx       # Sidebar de navegação
│   │   ├── header.tsx        # Header do dashboard
│   │   ├── image-upload.tsx  # Upload de imagens
│   │   └── color-picker.tsx  # Seletor de cores
│   ├── lib/                   # Utilitários e configurações
│   │   ├── firebase/         # Configuração Firebase
│   │   │   ├── config.ts     # Inicialização
│   │   │   ├── auth.ts       # Funções de autenticação
│   │   │   ├── firestore.ts  # Operações no Firestore
│   │   │   └── storage.ts    # Upload de arquivos
│   │   ├── hooks/            # React hooks customizados
│   │   │   ├── use-auth.ts   # Hook de autenticação
│   │   │   ├── use-tenant.ts # Hook de tenant
│   │   │   └── use-services.ts # Hook de serviços
│   │   └── utils.ts          # Funções utilitárias
│   └── types/                # Definições TypeScript
│       ├── tenant.ts
│       ├── service.ts
│       ├── booking.ts
│       └── availability.ts
├── public/                    # Arquivos estáticos
├── .env.local.example        # Exemplo de variáveis de ambiente
├── components.json           # Configuração shadcn/ui
├── tailwind.config.ts        # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
├── next.config.js            # Configuração Next.js
├── package.json              # Dependências
└── README.md                 # Este arquivo
```

## Firestore - Estrutura de Collections

### tenants
```typescript
{
  id: string;
  name: string;
  subdomain: string;
  ownerUid: string;
  whatsapp?: string;
  active: boolean;
  themeSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### services
```typescript
{
  id: string;
  tenantId: string;
  name: string;
  description: string;
  duration: number; // minutos
  price: number;
  imageUrl?: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### availability
```typescript
{
  id: string;
  tenantId: string;
  weekAvailability: {
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### bookings
```typescript
{
  id: string;
  tenantId: string;
  serviceId: string;
  serviceName: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  date: Timestamp;
  time: string; // HH:mm
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Regras de Segurança do Firestore

Configure as seguintes regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tenants: usuários podem ler/escrever apenas seu próprio tenant
    match /tenants/{tenantId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.ownerUid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.ownerUid;
    }

    // Services: apenas o dono do tenant pode manipular
    match /services/{serviceId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/tenants/$(resource.data.tenantId)) &&
        get(/databases/$(database)/documents/tenants/$(resource.data.tenantId)).data.ownerUid == request.auth.uid;
    }

    // Availability: apenas o dono do tenant pode manipular
    match /availability/{availabilityId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/tenants/$(resource.data.tenantId)) &&
        get(/databases/$(database)/documents/tenants/$(resource.data.tenantId)).data.ownerUid == request.auth.uid;
    }

    // Bookings: apenas o dono do tenant pode ler
    match /bookings/{bookingId} {
      allow read: if request.auth != null &&
        exists(/databases/$(database)/documents/tenants/$(resource.data.tenantId)) &&
        get(/databases/$(database)/documents/tenants/$(resource.data.tenantId)).data.ownerUid == request.auth.uid;
      allow create: if true; // Clientes podem criar agendamentos
    }
  }
}
```

## Regras de Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tenants/{tenantId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        firestore.get(/databases/(default)/documents/tenants/$(tenantId)).data.ownerUid == request.auth.uid;
    }
  }
}
```

## Fluxo de Uso

1. **Registro**: Usuário cria conta fornecendo nome da empresa, email, senha e subdomínio único
2. **Login**: Acesso com email e senha
3. **Dashboard**: Visualização de métricas e agendamentos recentes
4. **Serviços**: Cadastro de serviços com nome, descrição, duração, preço e imagem
5. **Horários**: Configuração de disponibilidade semanal
6. **Agendamentos**: Visualização de todos os agendamentos com filtros
7. **Personalização**: Customização de cores, logo e fonte
8. **Perfil**: Atualização de dados da empresa

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

## Responsividade

O painel é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## Navegadores Suportados

- Chrome (últimas 2 versões)
- Firefox (últimas 2 versões)
- Safari (últimas 2 versões)
- Edge (últimas 2 versões)

## Suporte

Para problemas ou dúvidas, abra uma issue no repositório do projeto.

## Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com Next.js 15 e Firebase**
