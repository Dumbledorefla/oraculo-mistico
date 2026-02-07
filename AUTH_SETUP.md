# Chave do Oráculo - Configuração de Autenticação Independente

Este documento descreve como configurar autenticação **100% independente** (sem Manus OAuth) para a plataforma Chave do Oráculo no Vercel.

## 📋 Opções de Autenticação

A plataforma atualmente usa **Manus OAuth**. Para migrar para autenticação independente, você tem 3 opções:

### Opção 1: Auth0 (Recomendado - Mais Fácil)
- ✅ Suporta login social (Google, GitHub, etc.)
- ✅ Gerenciamento de usuários
- ✅ Sem custo para até 7.000 usuários ativos
- ✅ Integração simples com NextAuth

### Opção 2: NextAuth.js (Open Source)
- ✅ Totalmente open source
- ✅ Suporta múltiplos provedores
- ✅ Controle total sobre dados
- ⚠️ Requer mais configuração

### Opção 3: Implementação Customizada com JWT
- ✅ Controle total
- ✅ Sem dependências externas
- ⚠️ Requer mais desenvolvimento
- ⚠️ Você é responsável pela segurança

## 🚀 Implementação Recomendada: Auth0

### Passo 1: Criar Conta no Auth0

1. Acesse [Auth0.com](https://auth0.com)
2. Clique em **Sign Up**
3. Crie uma conta gratuita
4. Confirme seu email

### Passo 2: Criar Aplicação Auth0

1. No dashboard Auth0, vá para **Applications**
2. Clique em **Create Application**
3. Nome: `Chave do Oráculo`
4. Tipo: **Single Page Application**
5. Clique em **Create**

### Passo 3: Configurar URLs

Na página de configuração da aplicação:

**Allowed Callback URLs:**
```
https://chavedooraculo.com/callback
http://localhost:3000/callback
```

**Allowed Logout URLs:**
```
https://chavedooraculo.com
http://localhost:3000
```

**Allowed Web Origins:**
```
https://chavedooraculo.com
http://localhost:3000
```

### Passo 4: Copiar Credenciais

Na aba **Settings**, copie:
- `Domain`: seu-dominio.auth0.com
- `Client ID`: seu-client-id

### Passo 5: Instalar Dependências

```bash
npm install @auth0/auth0-react
# ou
pnpm add @auth0/auth0-react
```

### Passo 6: Configurar Variáveis de Ambiente

No Vercel Dashboard, adicione:

```
VITE_AUTH0_DOMAIN=seu-dominio.auth0.com
VITE_AUTH0_CLIENT_ID=seu-client-id
VITE_AUTH0_CALLBACK_URL=https://chavedooraculo.com/callback
```

### Passo 7: Integrar Auth0 no React

Atualize `client/src/main.tsx`:

```tsx
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
```

### Passo 8: Usar Auth0 nos Componentes

```tsx
import { useAuth0 } from "@auth0/auth0-react";

export function LoginButton() {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  if (isAuthenticated) {
    return (
      <div>
        <p>Olá, {user?.name}!</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => loginWithRedirect()}>Login</button>;
}
```

### Passo 9: Sincronizar Usuários com Banco de Dados

Crie um endpoint tRPC para sincronizar usuários:

```ts
// server/routers.ts
export const appRouter = router({
  auth: {
    syncUser: publicProcedure
      .input(z.object({
        auth0Id: z.string(),
        email: z.string().email(),
        name: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Sincronizar usuário com banco de dados
        const user = await db.query.users.findFirst({
          where: eq(users.openId, input.auth0Id),
        });

        if (!user) {
          await db.insert(users).values({
            openId: input.auth0Id,
            email: input.email,
            name: input.name,
          });
        }

        return { success: true };
      }),
  },
});
```

## 🔄 Migração de Usuários Existentes

Se você já tem usuários no Manus, será necessário:

1. **Exportar dados do Manus**
   - Solicitar export de usuários ao Manus
   - Salvar em arquivo CSV

2. **Importar para novo sistema**
   ```bash
   pnpm db:seed-users ./users.csv
   ```

3. **Mapear IDs antigos para novos**
   - Adicionar campo `legacyMsId` na tabela users
   - Manter compatibilidade com dados antigos

## 🔐 Segurança

### Boas Práticas

- ✅ Nunca armazene senhas em texto plano
- ✅ Use HTTPS em produção
- ✅ Valide tokens JWT no backend
- ✅ Implemente rate limiting em endpoints de login
- ✅ Use CORS restritivo
- ✅ Rotinize chaves de segredo

### Proteção de Endpoints

```ts
// Middleware para validar token
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar autenticado",
    });
  }
  return next({ ctx });
});
```

## 📊 Banco de Dados - Tabela de Usuários

A tabela `users` precisa ser atualizada:

```sql
ALTER TABLE users ADD COLUMN auth0Id VARCHAR(256) UNIQUE;
ALTER TABLE users ADD COLUMN provider VARCHAR(64); -- 'auth0', 'google', etc.
ALTER TABLE users ADD COLUMN passwordHash VARCHAR(256); -- Se usar autenticação customizada
```

## 🧪 Testes

```bash
# Testar login local
npm run dev

# Testar no Vercel preview
vercel preview
```

## 🐛 Troubleshooting

### Erro: "Invalid redirect URI"
- Verifique se a URL está exatamente igual em Auth0 Settings
- Inclua protocolo (https://) e sem barra final

### Erro: "User not found"
- Verifique se a sincronização de usuários está funcionando
- Chame `syncUser` após login bem-sucedido

### Erro: "Token expired"
- Implemente refresh token
- Auth0 gerencia automaticamente

## 📞 Suporte

- **Auth0 Docs**: https://auth0.com/docs
- **Auth0 Support**: https://support.auth0.com
- **GitHub Issues**: https://github.com/Dumbledorefla/oraculo-mistico/issues

## 🎯 Próximas Etapas

1. ✅ Escolher provedor de autenticação
2. ✅ Criar conta e aplicação
3. ✅ Configurar variáveis de ambiente
4. ✅ Instalar dependências
5. ✅ Integrar no React
6. ✅ Testar login/logout
7. ✅ Sincronizar usuários com banco
8. ✅ Migrar usuários existentes (se aplicável)
9. ✅ Deploy em produção

---

**Última atualização**: Fevereiro 2026  
**Status**: Pronto para implementação
