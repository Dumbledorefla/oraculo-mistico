# Project TODO - Fase 2

## Sistema de Amostras Grátis (Freemium)
- [x] Criar tabela de produtos digitais no banco de dados
- [x] Criar tabela de amostras grátis com rastreamento de acessos
- [ ] Implementar lógica de amostra vs versão completa
- [x] Criar página de amostra grátis para cada tipo de produto

## Catálogo de Produtos
- [x] Criar página /mapas-jogos com listagem de produtos
- [x] Implementar cards de produtos com preço e descrição
- [x] Criar página de detalhes do produto
- [ ] Implementar seção de combos com desconto
- [x] Adicionar filtros por categoria (Amor, Carreira, etc.)

## Sistema de Pagamentos (Stripe)
- [x] Integrar Stripe ao projeto
- [x] Criar tabela de pedidos no banco de dados
- [x] Implementar checkout com Stripe
- [x] Criar webhooks para confirmação de pagamento
- [ ] Implementar lógica de liberação de produtos após pagamento

## Carrinho de Compras
- [x] Criar contexto de carrinho (React Context)
- [x] Implementar adicionar/remover itens do carrinho
- [x] Criar página de carrinho de compras
- [x] Implementar persistência do carrinho (localStorage)

## Área do Usuário
- [x] Criar página /meus-produtos para usuários logados
- [ ] Implementar acesso às interpretações completas
- [ ] Criar página /meus-pedidos com histórico de compras

## Navegação e Menu
- [x] Atualizar menu principal com novos links
- [ ] Adicionar submenu dropdown para categorias
- [ ] Implementar menu mobile responsivo

---

## Fase 1 (Concluída)
- [x] Autenticação de usuários (Manus OAuth)
- [x] Tarot interativo (Dia, Amor, Completo)
- [x] Numerologia básica
- [x] Horóscopo (12 signos)
- [x] Histórico de leituras
- [x] Página de perfil do usuário


---

## Fase 3 - Consultas com Taromantes

### Banco de Dados
- [x] Criar tabela de taromantes (perfil, especialidades, bio)
- [x] Criar tabela de disponibilidade/agenda
- [x] Criar tabela de consultas agendadas
- [x] Criar tabela de avaliações/reviews
- [x] Criar seed com 5 taromantes de exemplo

### Página de Listagem
- [x] Criar página /consultas com lista de taromantes
- [x] Implementar cards com foto, nome, especialidades e avaliação
- [x] Adicionar filtros por especialidade e disponibilidade
- [x] Mostrar preço por consulta
- [x] Adicionar busca por nome

### Perfil do Taromante
- [x] Criar página /taromante/:slug com perfil completo
- [x] Exibir bio, especialidades e experiência
- [x] Mostrar calendário de disponibilidade
- [x] Exibir avaliações de clientes
- [x] Mostrar serviços com preços diferentes

### Sistema de Agendamento
- [x] Implementar seleção de data e horário
- [x] Criar formulário de agendamento
- [x] Integrar com checkout Stripe
- [x] Criar página de sucesso de consulta
- [ ] Enviar confirmação por email/notificação

### Painel do Taromante
- [ ] Criar dashboard /painel-taromante
- [ ] Implementar gestão de agenda
- [ ] Criar gestão de serviços e preços
- [ ] Mostrar histórico de consultas
- [ ] Exibir relatório financeiro


---

## Fase 4 - Painel do Taromante, Cursos e Admin

### Painel do Taromante
- [x] Criar página /painel-taromante com dashboard
- [x] Implementar visualização de consultas agendadas
- [x] Criar gestão de serviços e preços
- [x] Mostrar calendário de disponibilidade editável
- [x] Exibir histórico de consultas realizadas
- [x] Criar relatório financeiro básico

### Sistema de Cursos
- [x] Criar tabela de cursos no banco de dados
- [x] Criar tabela de módulos e aulas
- [x] Criar tabela de progresso do aluno
- [x] Implementar página /cursos com listagem
- [x] Criar página de detalhes do curso
- [x] Implementar player de vídeo/conteúdo
- [x] Criar sistema de progresso e conclusão
- [ ] Integrar pagamento para cursos pagos

### Painel Administrativo
- [x] Criar página /admin com dashboard
- [x] Implementar listagem de usuários
- [ ] Criar gestão de produtos (em desenvolvimento)
- [ ] Implementar gestão de taromantes (em desenvolvimento)
- [x] Criar relatório de vendas
- [ ] Implementar sistema de comissões (em desenvolvimento)


---

## Fase 5 - Avaliações, Pagamentos de Cursos e UX

### Sistema de Avaliações
- [x] Criar componente de avaliação com estrelas
- [x] Implementar avaliação de consultas realizadas
- [ ] Implementar avaliação de cursos concluídos
- [x] Exibir avaliações nos perfis de taromantes
- [ ] Exibir avaliações nas páginas de cursos

### Pagamento de Cursos
- [x] Integrar checkout Stripe para cursos pagos
- [ ] Criar página de sucesso de matrícula
- [ ] Liberar acesso ao curso após pagamento
- [ ] Exibir cursos comprados em Meus Produtos

### Sistema de Notificações
- [ ] Implementar notificações in-app (toast/bell)
- [ ] Criar centro de notificações do usuário
- [ ] Notificar sobre consultas agendadas
- [ ] Notificar sobre novos cursos e promoções

### Melhorias de UX
- [x] Implementar menu mobile responsivo (hamburger)
- [x] Adicionar submenu dropdown para categorias
- [x] Melhorar navegação entre páginas
- [ ] Adicionar breadcrumbs nas páginas internas


---

## Fase 6 - Melhorias de Design e Freemium

### Personalização Auth0
- [x] Personalizar tela de login do Auth0 com design místico

### Modelo Freemium para Tarot
- [x] Implementar paywall nos jogos de Tarot (exceto Tarot Diário)
- [x] Adicionar campo de data de nascimento em todos os jogos premium
- [x] Criar componente TarotPaywall

### Design das Cartas
- [x] Mudar cores das cartas para design mais místico (roxo)
- [x] Atualizar paleta de cores das cartas de Tarot

### Deploy
- [x] Fazer deploy e testar no chavedooraculo.com


---

## Fase 7 - Logo Auth0 e Painel Admin

### Logo Auth0
- [x] Criar logo do Chave do Oráculo
- [x] Fazer upload no Auth0
- [x] Testar tela de login

### Painel Admin
- [x] Criar estrutura do painel admin (/admin)
- [x] Implementar autenticação admin (verificar role)
- [x] Dashboard com estatísticas gerais
- [x] Gestão de usuários (listar, editar, bloquear)
- [x] Gestão de jogos (ativar/desativar, estatísticas)
- [x] Gestão de consultas (listar, aprovar, cancelar)
- [x] Gestão de pagamentos (listar transações, reembolsos)
- [x] Gestão de assinaturas (ativas, canceladas, renovações)
- [x] Configurações do site (preços, textos, emails)
- [ ] Deploy e teste do painel admin
