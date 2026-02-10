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


---

## Fase 8 - Personalização Completa Auth0

### Domínio Customizado
- [x] Verificar domínio auth.chavedooraculo.com no Auth0 (já estava READY)
- [x] Configurar VITE_AUTH0_DOMAIN para auth.chavedooraculo.com

### Tema Místico no Universal Login
- [x] Configurar cores primárias (roxo #8B5CF6, dourado #d4a853)
- [x] Adicionar imagem de fundo com nebulosa celestial
- [x] Configurar logo do Chave do Oráculo (80px)
- [x] Configurar bordas douradas no widget
- [x] Publicar tema no Auth0

### Variáveis de Ambiente
- [x] Atualizar VITE_AUTH0_DOMAIN no projeto Manus
- [ ] Atualizar VITE_AUTH0_DOMAIN no Vercel (dashboard temporariamente indisponível)
- [ ] Fazer deploy com novo domínio no Vercel

## Fase 8 - Bugs Auth0
- [ ] Corrigir fundo branco na tela de login do Auth0 (deveria ser nebulosa mística)
- [ ] Corrigir erro piscando na tela de login do Auth0


---

## OB1 - Ajustes Globais (Prioridade Alta)

### 1. Identidade Visual - Remover Amarelo Infantil
- [ ] Remover amarelo forte de cards como cor dominante
- [ ] Remover amarelo forte de botões como cor principal
- [ ] Remover amarelo forte de fundos de seção
- [ ] Aplicar paleta mística: roxo, violeta, azul escuro como cores principais
- [ ] Usar dourado suave apenas em detalhes (ícones, divisórias, bordas finas)
- [ ] Garantir sensação de mistério, profundidade e confiança

### 2. Padronização de Dados do Usuário (Global)
- [ ] Adicionar coleta obrigatória de nome completo em todos os métodos
- [ ] Adicionar coleta obrigatória de data de nascimento em todos os métodos
- [ ] Apresentar campos como primeiro passo do método
- [ ] Em métodos de amor: adicionar campos opcionais para nome e data da outra pessoa
- [ ] Pré-preencher dados automaticamente se usuário estiver logado
- [ ] Permitir edição dos dados pré-preenchidos

### 3. Estratégia Freemium - Upsell em Métodos Gratuitos
- [ ] Adicionar bloco de conversão ao final de todos os métodos gratuitos
- [ ] Incluir texto explicando versão mais profunda/completa
- [ ] Adicionar CTA claro para método pago relacionado
- [ ] Garantir que botão leva diretamente para método pago relevante

### 4. Ajuste da Home
- [ ] Reduzir altura do hero principal
- [ ] Mostrar cards de métodos logo abaixo do hero (acima da dobra)
- [ ] Destacar: Tarot, Mapa Astral/Ano, Numerologia, Consultas
- [ ] Garantir que usuário entende variedade de métodos nos primeiros segundos

### 5. Posicionamento de Métodos Pagos
- [ ] Criar cards mais ricos para métodos pagos
- [ ] Adicionar mais texto explicativo em métodos pagos
- [ ] Aplicar destaque visual sutil em métodos pagos
- [ ] Diferenciar claramente métodos pagos de gratuitos

### 6. Tom de Texto e Comunicação (Global)
- [ ] Substituir "Processamento concluído" por mensagem acolhedora
- [ ] Substituir "Pedido confirmado" por mensagem humana
- [ ] Substituir "Resultado gerado" por mensagem clara e simples
- [ ] Revisar todos os textos para linguagem acolhedora, clara e simples
- [ ] Remover juridiquês e tom robótico


---

## OB1 - Fase Atual (Implementação em Andamento)

### 1.1. Identidade Visual - Cores Principais (CONCLUÍDO)
- [x] Atualizar variável CSS --primary de amber para purple
- [x] Atualizar TarotPaywall.tsx para paleta roxa
- [x] Atualizar Header.tsx (logo) para paleta roxa
- [x] Atualizar StarRating.tsx (estrelas com dourado sutil)
- [x] Atualizar App.tsx (botão de consulta)
- [x] Atualizar AdminPanel.tsx (todos os botões e cores)

### 1.2. Identidade Visual - Páginas Secundárias (PARCIALMENTE CONCLUÍDO)
- [x] Atualizar Consultations.tsx (remover todas as referências amber)
- [x] Atualizar TarotGame.tsx (43 substituições amber/yellow → purple)
- [x] Atualizar TaromantePanel.tsx (18 substituições amber/yellow → purple)
- [ ] Atualizar TaromanteProfile.tsx (14 referências amber restantes)
- [ ] Atualizar Courses.tsx (11 referências amber restantes)
- [ ] Atualizar CourseDetail.tsx (9 referências amber restantes)
- [ ] Atualizar Home.tsx (6 referências amber/yellow restantes)
- [ ] Atualizar UpsellBlock.tsx (3 referências amber)
- [ ] Atualizar StarRating.tsx (2 referências yellow)
- [ ] Atualizar componentes admin (AdminConsultations, AdminGames, AdminPayments, AdminStats)
- [ ] Revisar todas as páginas para garantir consistência visual

### 2. Coleta de Dados do Usuário (CONCLUÍDO)
- [x] Criar componente UserDataForm.tsx (nome + data de nascimento)
- [x] Adicionar schema no banco para armazenar nome e data de nascimento
- [x] Integrar UserDataForm no TarotGame.tsx (antes de mostrar resultado)
- [x] Adicionar campos opcionais de parceiro no Tarot do Amor
- [x] Integrar UserDataForm na Numerologia
- [x] Integrar UserDataForm no Horóscopo
- [x] Implementar pré-preenchimento para usuários logados
- [x] Criar tRPC endpoint para salvar/atualizar dados do usuário

### 3. Blocos de Upsell Freemium (CONCLUÍDO)
- [x] Criar componente UpsellBlock.tsx reutilizável
- [x] Adicionar UpsellBlock ao final do Tarot do Dia → link para Tarot Completo
- [x] Adicionar UpsellBlock ao final da Numerologia → link para Numerologia Completa
- [x] Adicionar UpsellBlock ao final do Horóscopo → link para Mapa Astral
- [x] Revisar textos (tom acolhedor: "Essa leitura gratuita oferece uma visão inicial...")

### 4. Ajuste da Home (CONCLUÍDO)
- [x] Reduzir altura do hero de 100vh para ~70vh
- [x] Criar seção MethodsGrid logo abaixo do hero
- [x] Adicionar 4-6 cards de métodos visíveis sem scroll
- [x] Cards devem incluir: Tarot, Mapa Astral, Numerologia, Consultas
- [x] Diferenciar visualmente métodos gratuitos vs pagos (borda dourada, ícone Sparkles)

### 5. Tom de Comunicação (CONCLUÍDO)
- [x] Revisar CheckoutSuccess.tsx (mensagens mais humanas)
- [x] Revisar mensagens de sucesso em consultas
- [x] Revisar mensagens de erro (tornar acolhedoras)
- [x] Revisar textos de loading/processamento
- [x] Buscar e substituir textos genéricos por mensagens acolhedoras


---

## Simplificação de Arquitetura Auth0 (EM ANDAMENTO)
- [x] Instalar @auth0/auth0-react no frontend
- [x] Criar AuthProvider com Auth0Provider
- [x] Atualizar useAuth para usar Auth0 SDK
- [x] Remover dependência do servidor Express para autenticação
- [x] Atualizar vercel.json para SPA puro
- [ ] Testar login/logout no ambiente local
- [ ] Fazer deploy e testar em produção
