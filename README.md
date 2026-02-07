# Chave do Oráculo 🔮

Uma plataforma esotérica e mística completa com Tarot, Numerologia, Horóscopo, e-commerce de produtos digitais, consultas com taromantes, cursos e painel administrativo.

**Status**: ✅ Completo e pronto para produção  
**Hosting**: Vercel (chavedooraculo.com)  
**Framework**: React 19 + TypeScript + Tailwind CSS  
**Backend**: Express + tRPC + Drizzle ORM  
**Pagamentos**: Stripe  
**Banco de Dados**: MySQL/PostgreSQL  

## 🎯 Funcionalidades

### Público (Grátis)
- ✅ **Tarot do Dia** - Leitura diária com 1 carta
- ✅ **Numerologia** - Cálculo de 5 números místicos
- ✅ **Horóscopo** - Previsões para 12 signos
- ✅ **Histórico de Leituras** - Salvo no perfil do usuário

### E-commerce
- ✅ **Catálogo de Produtos** - 14 produtos digitais
- ✅ **Amostras Grátis** - Preview de produtos
- ✅ **Carrinho de Compras** - Persistência local
- ✅ **Checkout Stripe** - Pagamento seguro
- ✅ **Meus Produtos** - Acesso a produtos comprados

### Consultas
- ✅ **Listagem de Taromantes** - 5 especialistas
- ✅ **Perfil do Taromante** - Bio, especialidades, avaliações
- ✅ **Calendário de Disponibilidade** - Agendamento
- ✅ **Sistema de Agendamento** - Com confirmação
- ✅ **Pagamento de Consultas** - Via Stripe

### Cursos
- ✅ **Catálogo de Cursos** - 6 cursos (grátis e pagos)
- ✅ **Módulos e Aulas** - Estrutura completa
- ✅ **Progresso do Aluno** - Rastreamento
- ✅ **Certificado** - Ao completar cursos
- ✅ **Checkout de Cursos** - Integrado com Stripe

### Painel Administrativo
- ✅ **Dashboard** - Estatísticas gerais
- ✅ **Gestão de Usuários** - CRUD completo
- ✅ **Gestão de Pedidos** - Histórico de vendas
- ✅ **Gestão de Produtos** - Adicionar/editar/deletar
- ✅ **Gestão de Cursos** - Módulos e aulas
- ✅ **Painel do Taromante** - Agenda e financeiro

### Sistema de Avaliações
- ✅ **Avaliações com Estrelas** - 1-5 estrelas
- ✅ **Comentários** - Feedback dos clientes
- ✅ **Moderação** - Painel admin

## 🛠️ Stack Técnico

### Frontend
- React 19 com TypeScript
- Vite para build otimizado
- Tailwind CSS 4 com tema místico
- Framer Motion para animações
- React Router para navegação
- Shadcn/ui para componentes

### Backend
- Express.js
- tRPC para RPC type-safe
- Drizzle ORM
- MySQL/PostgreSQL
- Stripe SDK

### Deployment
- Vercel (hosting)
- GitHub (versionamento)
- Stripe (pagamentos)
- SendGrid/Mailgun (emails)

## 📦 Instalação Local

### Pré-requisitos
- Node.js 18+
- pnpm (gerenciador de pacotes)
- MySQL ou PostgreSQL local

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/Dumbledorefla/oraculo-mistico.git
cd oraculo-mistico

# 2. Instale dependências
pnpm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Inicialize o banco de dados
pnpm db:push

# 5. Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000`

## 🚀 Deployment no Vercel

Veja [VERCEL_SETUP.md](./VERCEL_SETUP.md) para instruções completas de deployment.

### Resumo Rápido

```bash
# 1. Faça login no Vercel
vercel login

# 2. Deploy
vercel --prod

# 3. Configure variáveis de ambiente no Vercel Dashboard
# DATABASE_URL, STRIPE_SECRET_KEY, JWT_SECRET, etc.

# 4. Execute migrações
vercel env pull
pnpm db:push
```

## 📁 Estrutura do Projeto

```
├── client/                      # Frontend React
│   ├── src/
│   │   ├── pages/              # Páginas principais
│   │   │   ├── Home.tsx        # Homepage
│   │   │   ├── TarotDia.tsx    # Tarot do Dia
│   │   │   ├── Numerology.tsx  # Numerologia
│   │   │   ├── Horoscope.tsx   # Horóscopo
│   │   │   ├── Products.tsx    # Catálogo de produtos
│   │   │   ├── Consultations.tsx # Consultas
│   │   │   ├── Courses.tsx     # Cursos
│   │   │   └── AdminPanel.tsx  # Painel admin
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── lib/                # Utilitários
│   │   └── index.css           # Estilos globais
│   └── public/                 # Assets estáticos
│
├── server/                      # Backend Express + tRPC
│   ├── routers.ts              # Endpoints da API
│   ├── db.ts                   # Helpers de banco de dados
│   ├── storage.ts              # Upload de arquivos
│   ├── stripe/                 # Integração Stripe
│   ├── _core/                  # Configuração interna
│   └── seed*.ts                # Scripts de seed
│
├── drizzle/                     # Schema e migrações
│   ├── schema.ts               # Definição das tabelas
│   └── migrations/             # Histórico de migrações
│
├── shared/                      # Código compartilhado
│   ├── types.ts                # Tipos TypeScript
│   └── const.ts                # Constantes
│
├── vercel.json                 # Configuração Vercel
├── vite.config.ts              # Configuração Vite
├── drizzle.config.ts           # Configuração Drizzle
└── package.json                # Dependências
```

## 🧪 Testes

```bash
# Rodar testes
pnpm test

# Com coverage
pnpm test -- --coverage
```

## 🔧 Variáveis de Ambiente

Veja `.env.example` para todas as variáveis necessárias:

```env
# Banco de dados
DATABASE_URL=mysql://...

# Autenticação
JWT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SENDGRID_API_KEY=SG....
EMAIL_FROM=noreply@chavedooraculo.com
```

## 📊 Banco de Dados

### Tabelas Principais

- **users** - Usuários e autenticação
- **products** - Produtos digitais
- **orders** - Pedidos de produtos
- **consultations** - Agendamentos de consultas
- **taromantes** - Perfis dos taromantes
- **courses** - Cursos disponíveis
- **course_enrollments** - Inscrições em cursos
- **reviews** - Avaliações de produtos/taromantes
- **tarot_readings** - Histórico de leituras de tarot

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Senhas com hash bcrypt
- ✅ HTTPS/SSL automático (Vercel)
- ✅ CORS configurado
- ✅ Validação de entrada com Zod
- ✅ Proteção contra CSRF
- ✅ Rate limiting em endpoints sensíveis

## 📈 Performance

- ✅ Vite para build otimizado
- ✅ Code splitting automático
- ✅ Lazy loading de rotas
- ✅ Caching de assets
- ✅ Compressão Gzip
- ✅ CDN via Vercel

## 🐛 Troubleshooting

### Erro ao conectar ao banco de dados
```bash
# Verifique a DATABASE_URL
echo $DATABASE_URL

# Teste a conexão
pnpm db:push
```

### Erro ao fazer upload de arquivos
- Verifique se as credenciais S3 estão configuradas
- Verifique permissões do bucket

### Erro de pagamento Stripe
- Verifique se STRIPE_SECRET_KEY está correto
- Verifique se o webhook está configurado

## 📞 Suporte

Para problemas ou dúvidas:
- 📧 Email: admin@chavedooraculo.com
- 🔗 GitHub: https://github.com/Dumbledorefla/oraculo-mistico
- 📚 Docs: [VERCEL_SETUP.md](./VERCEL_SETUP.md)

## 📄 Licença

MIT - Veja [LICENSE](./LICENSE) para detalhes

## 🙏 Créditos

Desenvolvido com ❤️ para a comunidade esotérica.

---

**Última atualização**: Fevereiro 2026  
**Versão**: 1.0.0  
**Status**: Production Ready ✅
