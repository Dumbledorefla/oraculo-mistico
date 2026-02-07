# Chave do Oráculo - Checklist de Migração para Vercel Independente

Este documento fornece um checklist completo para migrar a plataforma do Manus para Vercel 100% independente.

## ✅ Fase 1: Preparação (Semana 1)

### Banco de Dados
- [ ] Escolher provedor (PlanetScale, AWS RDS, Supabase, etc.)
- [ ] Criar banco de dados
- [ ] Copiar string de conexão
- [ ] Testar conexão local
- [ ] Executar migrações (`pnpm db:push`)
- [ ] Verificar todas as tabelas criadas

### Autenticação
- [ ] Escolher provedor (Auth0, NextAuth, customizado)
- [ ] Criar conta no provedor
- [ ] Criar aplicação/projeto
- [ ] Copiar credenciais (Client ID, Domain, etc.)
- [ ] Configurar URLs de callback
- [ ] Testar login local
- [ ] Implementar logout

### Pagamentos (Stripe)
- [ ] Criar conta Stripe
- [ ] Copiar chaves (Secret Key, Publishable Key)
- [ ] Configurar webhook endpoint
- [ ] Testar pagamento em modo teste
- [ ] Documentar fluxo de pagamento

### Email
- [ ] Escolher serviço (SendGrid, Mailgun, etc.)
- [ ] Criar conta
- [ ] Copiar API Key
- [ ] Configurar domínio de email
- [ ] Testar envio de email

## ✅ Fase 2: Configuração no Vercel (Semana 2)

### Projeto Vercel
- [ ] Criar projeto no Vercel
- [ ] Conectar repositório GitHub
- [ ] Configurar branch principal (main)
- [ ] Configurar domínio customizado (chavedooraculo.com)
- [ ] Ativar SSL/HTTPS

### Variáveis de Ambiente
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] SENDGRID_API_KEY (ou equivalente)
- [ ] EMAIL_FROM
- [ ] EMAIL_ADMIN
- [ ] VITE_AUTH0_DOMAIN (ou equivalente)
- [ ] VITE_AUTH0_CLIENT_ID
- [ ] VITE_APP_TITLE
- [ ] VITE_APP_LOGO
- [ ] NODE_ENV=production

### Build & Deploy
- [ ] Testar build local (`pnpm build`)
- [ ] Verificar arquivo dist/public
- [ ] Fazer deploy preview
- [ ] Testar rotas (SPA routing)
- [ ] Verificar logs de erro

## ✅ Fase 3: Testes Funcionais (Semana 3)

### Autenticação
- [ ] Login com email/senha funciona
- [ ] Login social (Google, GitHub) funciona
- [ ] Logout funciona
- [ ] Tokens persistem entre recargas
- [ ] Usuários salvos no banco de dados
- [ ] Perfil do usuário acessível

### E-commerce
- [ ] Catálogo de produtos carrega
- [ ] Amostras grátis funcionam
- [ ] Carrinho adiciona/remove itens
- [ ] Checkout Stripe funciona
- [ ] Pagamento bem-sucedido atualiza banco
- [ ] Usuário recebe acesso ao produto
- [ ] Histórico de pedidos acessível

### Consultas
- [ ] Listagem de taromantes carrega
- [ ] Perfil do taromante acessível
- [ ] Calendário de disponibilidade funciona
- [ ] Agendamento salva no banco
- [ ] Pagamento de consulta funciona
- [ ] Email de confirmação enviado
- [ ] Taromante vê agendamento

### Cursos
- [ ] Catálogo de cursos carrega
- [ ] Inscrição em curso grátis funciona
- [ ] Checkout de curso pago funciona
- [ ] Progresso do aluno salvo
- [ ] Certificado gerado ao completar
- [ ] Email de conclusão enviado

### Admin
- [ ] Dashboard carrega
- [ ] Estatísticas corretas
- [ ] Listagem de usuários funciona
- [ ] Listagem de pedidos funciona
- [ ] Gestão de produtos funciona
- [ ] Gestão de cursos funciona

### Tarot/Numerologia/Horóscopo
- [ ] Tarot do Dia funciona
- [ ] Leitura salva no histórico
- [ ] Numerologia calcula corretamente
- [ ] Horóscopo carrega para todos os signos
- [ ] Histórico de leituras acessível

## ✅ Fase 4: Otimização & Segurança (Semana 4)

### Performance
- [ ] Lighthouse score > 80
- [ ] Tempo de carregamento < 3s
- [ ] Core Web Vitals otimizados
- [ ] Imagens otimizadas
- [ ] Cache configurado corretamente
- [ ] CDN funcionando

### Segurança
- [ ] HTTPS ativado
- [ ] CORS configurado
- [ ] Rate limiting implementado
- [ ] Validação de entrada em todos os endpoints
- [ ] Proteção contra CSRF
- [ ] Senhas com hash bcrypt
- [ ] Tokens JWT validados
- [ ] Logs de segurança configurados

### Monitoramento
- [ ] Vercel Analytics ativado
- [ ] Error tracking configurado
- [ ] Logs de erro acessíveis
- [ ] Alertas configurados
- [ ] Backup automático do banco
- [ ] Plano de recuperação de desastres

## ✅ Fase 5: Migração de Dados (Semana 5)

### Usuários
- [ ] Exportar usuários do Manus
- [ ] Mapear dados antigos
- [ ] Importar para novo banco
- [ ] Validar integridade dos dados
- [ ] Testar login de usuários migrados

### Pedidos
- [ ] Exportar histórico de pedidos
- [ ] Importar para novo banco
- [ ] Validar totais e datas
- [ ] Testar acesso a produtos antigos

### Consultas
- [ ] Exportar agendamentos
- [ ] Importar para novo banco
- [ ] Notificar usuários sobre mudança
- [ ] Testar acesso a histórico

### Cursos
- [ ] Exportar inscrições
- [ ] Importar progresso dos alunos
- [ ] Validar certificados
- [ ] Testar acesso a aulas

## ✅ Fase 6: Comunicação & Lançamento (Semana 6)

### Comunicação
- [ ] Notificar usuários sobre migração
- [ ] Criar FAQ sobre mudanças
- [ ] Preparar guia de troubleshooting
- [ ] Configurar suporte (email, chat)

### Lançamento
- [ ] Fazer backup completo do Manus
- [ ] Agendar janela de manutenção
- [ ] Fazer último sync de dados
- [ ] Ativar novo site
- [ ] Monitorar erros em tempo real
- [ ] Estar pronto para rollback

### Pós-Lançamento
- [ ] Monitorar performance
- [ ] Responder a feedback dos usuários
- [ ] Corrigir bugs críticos
- [ ] Documentar lições aprendidas
- [ ] Desativar Manus (após período de teste)

## 📋 Documentação Necessária

- [ ] README.md - Instruções de setup
- [ ] VERCEL_SETUP.md - Guia de deployment
- [ ] AUTH_SETUP.md - Configuração de autenticação
- [ ] API.md - Documentação de endpoints
- [ ] TROUBLESHOOTING.md - Solução de problemas
- [ ] ARCHITECTURE.md - Arquitetura do sistema

## 🔧 Ferramentas Necessárias

- [ ] Vercel CLI (`npm i -g vercel`)
- [ ] GitHub CLI (`gh`)
- [ ] MySQL Client (para testes de banco)
- [ ] Postman/Insomnia (para testes de API)
- [ ] Stripe CLI (para testes de webhook)

## 📞 Contatos Importantes

- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Auth0 Support**: https://support.auth0.com
- **SendGrid Support**: https://support.sendgrid.com
- **GitHub Support**: https://support.github.com

## 🎯 Métricas de Sucesso

- ✅ 100% de uptime após lançamento
- ✅ Tempo de resposta < 200ms
- ✅ Taxa de erro < 0.1%
- ✅ Satisfação do usuário > 4.5/5
- ✅ Sem perda de dados
- ✅ Todos os testes passando

## 📅 Timeline Estimada

| Fase | Duração | Status |
|------|---------|--------|
| 1. Preparação | 1 semana | ⬜ Não iniciado |
| 2. Configuração Vercel | 1 semana | ⬜ Não iniciado |
| 3. Testes Funcionais | 1 semana | ⬜ Não iniciado |
| 4. Otimização & Segurança | 1 semana | ⬜ Não iniciado |
| 5. Migração de Dados | 1 semana | ⬜ Não iniciado |
| 6. Lançamento | 1 semana | ⬜ Não iniciado |
| **Total** | **6 semanas** | ⬜ Não iniciado |

## 📝 Notas

- Cada fase pode ser ajustada conforme necessário
- Testes devem ser contínuos durante todo o processo
- Manter comunicação regular com stakeholders
- Documentar todas as decisões técnicas
- Preparar plano de rollback para cada fase

---

**Última atualização**: Fevereiro 2026  
**Responsável**: [Seu Nome]  
**Status**: Pronto para iniciar
