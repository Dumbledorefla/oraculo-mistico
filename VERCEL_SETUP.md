# Chave do Oráculo - Vercel Deployment Guide

Este documento descreve como configurar e fazer deploy da plataforma **Chave do Oráculo** no Vercel de forma **100% independente** (sem dependências do Manus).

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Stripe](https://stripe.com) para pagamentos
- Serviço de email (SendGrid, Mailgun ou similar)
- Banco de dados MySQL ou PostgreSQL (PlanetScale, AWS RDS, etc.)
- Repositório GitHub: `Dumbledorefla/oraculo-mistico`

## 🚀 Passo 1: Preparar o Banco de Dados

### Opção A: PlanetScale (Recomendado para MySQL)

1. Crie uma conta em [PlanetScale](https://planetscale.com)
2. Crie um novo banco de dados chamado `oraculo_mistico`
3. Copie a string de conexão MySQL
4. Salve em um lugar seguro (será usada em Vercel)

### Opção B: AWS RDS ou Supabase

1. Configure um banco de dados PostgreSQL ou MySQL
2. Anote a string de conexão (DATABASE_URL)

## 🔐 Passo 2: Configurar Variáveis de Ambiente no Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione o projeto `oraculo-mistico`
3. Vá para **Settings → Environment Variables**
4. Adicione as seguintes variáveis:

### Banco de Dados
```
DATABASE_URL = mysql://user:password@host/database
```

### Autenticação
```
JWT_SECRET = [gere com: openssl rand -base64 32]
```

### Stripe
```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
```

### Email (SendGrid)
```
SENDGRID_API_KEY = SG....
EMAIL_FROM = noreply@chavedooraculo.com
EMAIL_ADMIN = admin@chavedooraculo.com
```

### Aplicação
```
NODE_ENV = production
VITE_APP_TITLE = Chave do Oráculo
VITE_APP_LOGO = https://seu-cdn.com/logo.png
```

## 🔗 Passo 3: Configurar Webhook do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para **Developers → Webhooks**
3. Clique em **Add Endpoint**
4. URL do endpoint: `https://chavedooraculo.com/api/stripe/webhook`
5. Selecione eventos:
   - `payment_intent.succeeded`
   - `charge.refunded`
   - `customer.subscription.updated`
6. Copie o **Signing Secret** e adicione como `STRIPE_WEBHOOK_SECRET` no Vercel

## 📧 Passo 4: Configurar Serviço de Email

### SendGrid (Recomendado)

1. Crie uma conta em [SendGrid](https://sendgrid.com)
2. Vá para **Settings → API Keys**
3. Crie uma nova API Key
4. Copie e adicione como `SENDGRID_API_KEY` no Vercel

### Alternativa: Mailgun

1. Crie uma conta em [Mailgun](https://mailgun.com)
2. Copie a API Key e Domain
3. Adicione como `MAILGUN_API_KEY` e `MAILGUN_DOMAIN` no Vercel

## 🔄 Passo 5: Fazer Deploy no Vercel

### Opção A: Via Dashboard Vercel

1. Vá para [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **Add New → Project**
3. Selecione o repositório `Dumbledorefla/oraculo-mistico`
4. Configure as variáveis de ambiente (passo 2)
5. Clique em **Deploy**

### Opção B: Via Vercel CLI

```bash
# Instale Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

## 🗄️ Passo 6: Inicializar o Banco de Dados

Após o primeiro deploy, execute as migrações:

```bash
# Via Vercel CLI
vercel env pull

# Execute as migrações
pnpm db:push
```

Ou via dashboard Vercel (se tiver acesso ao console):

```bash
pnpm db:push
```

## 🧪 Passo 7: Testar a Aplicação

1. Acesse `https://chavedooraculo.com`
2. Teste as funcionalidades:
   - ✅ Tarot do Dia (grátis)
   - ✅ Numerologia (grátis)
   - ✅ Horóscopo (grátis)
   - ✅ Login/Registro
   - ✅ Compra de produtos (Stripe)
   - ✅ Agendamento de consultas
   - ✅ Inscrição em cursos

## 🔧 Troubleshooting

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está correta
- Verifique se o banco de dados está acessível
- Para PlanetScale, certifique-se de usar a string de conexão correta

### Erro: "Stripe webhook failed"
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Verifique se o endpoint está acessível em `https://chavedooraculo.com/api/stripe/webhook`

### Erro: "Email not sent"
- Verifique se `SENDGRID_API_KEY` está correto
- Verifique se `EMAIL_FROM` é um domínio verificado no SendGrid

### Erro: "404 on new routes"
- Verifique se `vercel.json` tem a configuração correta de SPA routing
- Limpe o cache do Vercel: **Settings → Git → Redeploy**

## 📚 Estrutura do Projeto

```
analise-personare-site/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── lib/           # Utilitários e hooks
│   └── public/            # Assets estáticos
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Endpoints da API
│   ├── db.ts              # Helpers de banco de dados
│   └── _core/             # Configuração interna
├── drizzle/               # Schema e migrações do banco
├── vercel.json            # Configuração de deploy
├── vite.config.ts         # Configuração do Vite
└── package.json           # Dependências
```

## 🔐 Segurança

- **Nunca** commit `.env` ou `.env.local`
- Use variáveis de ambiente do Vercel para secrets
- Rotinize as chaves do Stripe regularmente
- Monitore logs de erro no Vercel Dashboard

## 📞 Suporte

Para problemas com:
- **Vercel**: https://vercel.com/support
- **Stripe**: https://support.stripe.com
- **SendGrid**: https://support.sendgrid.com

## 🎯 Próximos Passos

1. ✅ Configurar domínio customizado (chavedooraculo.com)
2. ✅ Configurar SSL/HTTPS (automático no Vercel)
3. ✅ Configurar analytics (Vercel Analytics ou Google Analytics)
4. ✅ Configurar backups automáticos do banco de dados
5. ✅ Monitorar performance e uptime
