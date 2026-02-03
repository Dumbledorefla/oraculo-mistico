# Planejamento: App de Tarot, Numerologia e Astrologia

## Funcionalidades Principais

### 1. Tarot Interativo
- **Tarot do Dia**: 1 carta, gratuito
- **Tarot do Amor**: 3 cartas, amostra grátis + premium
- **Tarot Completo**: 6 cartas, premium

**Fluxo:**
1. Usuário insere nome
2. Mentaliza a pergunta
3. Embaralha as cartas (animação)
4. Seleciona carta(s)
5. Vê resultado (resumido grátis / completo pago)

### 2. Numerologia
- **Número do Destino**: Calculado pela data de nascimento
- **Número da Expressão**: Calculado pelo nome completo
- **Número da Alma**: Calculado pelas vogais do nome
- **Número da Personalidade**: Calculado pelas consoantes

**Fluxo:**
1. Usuário insere nome completo e data de nascimento
2. Sistema calcula os números
3. Exibe interpretação (resumida grátis / completa pago)

### 3. Horóscopo
- **12 Signos**: Previsões diárias
- **Áreas**: Amor, Trabalho, Saúde, Dinheiro
- **Compatibilidade**: Entre dois signos

### 4. Modelo de Negócio (Simulado)
- Amostras grátis com resultados parciais
- Botão "Ver resultado completo" (simulado)
- Banner de assinatura premium

## Estrutura de Páginas
- `/` - Home com acesso rápido
- `/tarot` - Hub de jogos de Tarot
- `/tarot/dia` - Tarot do Dia
- `/tarot/amor` - Tarot do Amor
- `/numerologia` - Calculadora Numerológica
- `/horoscopo` - Horóscopo por signo
- `/horoscopo/:signo` - Previsão do signo

## Assets Necessários
- 22 cartas de Tarot (Arcanos Maiores)
- Backgrounds místicos
- Ícones dos 12 signos
- Animações de embaralhamento
