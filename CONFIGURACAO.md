# 🔗 Encurtador de Links — Guia de Configuração

## O que você vai usar
- **Firebase Firestore** → banco de dados (gratuito)
- **Netlify** → hospedagem + funções de redirect (gratuito)
- **GitHub** → para conectar ao Netlify (gratuito)

---

## PASSO 1 — Configurar o Firebase

1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"** (ou use um existente)
3. No menu esquerdo, clique em **Firestore Database**
4. Clique em **"Criar banco de dados"** → escolha **modo de produção** → selecione região **southamerica-east1 (São Paulo)**
5. Vá em **Configurações do projeto** (ícone de engrenagem) → **Seus apps** → clique em **</>** (Web)
6. Dê um nome ao app (ex: "encurtador") e clique em **Registrar app**
7. Copie o objeto `firebaseConfig` que aparecer — parece assim:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "meu-projeto.firebaseapp.com",
     projectId: "meu-projeto",
     ...
   };
   ```
8. Abra o arquivo **`public/index.html`** e cole esse objeto substituindo o trecho marcado com `🔧`

### Regras do Firestore
No console Firebase → Firestore → **Regras**, cole:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{linkId} {
      allow read, write: if true;
    }
  }
}
```
*(Isso permite leitura/escrita pública — ok para uso pessoal)*

---

## PASSO 2 — Criar conta de serviço (para o redirect funcionar)

1. No Firebase Console → **Configurações do projeto** → aba **"Contas de serviço"**
2. Clique em **"Gerar nova chave privada"** → baixa um arquivo `.json`
3. Abra esse arquivo JSON e anote:
   - `project_id`
   - `client_email`
   - `private_key`

Esses três valores vão para as variáveis de ambiente do Netlify (Passo 4).

---

## PASSO 3 — Publicar no GitHub

1. Crie um repositório novo em https://github.com/new (pode ser privado)
2. Faça upload de todos os arquivos desta pasta para o repositório
3. Commit e push

---

## PASSO 4 — Configurar o Netlify

1. Acesse https://app.netlify.com e faça login
2. Clique em **"Add new site"** → **"Import an existing project"** → escolha **GitHub**
3. Selecione o repositório que você criou
4. Em **Build settings**, deixe assim:
   - Build command: *(vazio)*
   - Publish directory: `public`
5. Clique em **"Deploy site"**

### Adicionar variáveis de ambiente no Netlify
Vá em: **Site settings → Environment variables → Add variable**

Adicione estas 3 variáveis (com os valores do arquivo JSON do Passo 2):

| Nome | Valor |
|------|-------|
| `FIREBASE_PROJECT_ID` | seu project_id |
| `FIREBASE_CLIENT_EMAIL` | seu client_email |
| `FIREBASE_PRIVATE_KEY` | seu private_key (com as aspas e \\n) |

6. Vá em **Deploys** → clique em **"Trigger deploy"** para reaplicar com as variáveis

---

## PASSO 5 — Testar!

1. Abra a URL do seu site Netlify (ex: `https://meu-site.netlify.app`)
2. Cole o link gigante da assinatura digital
3. Clique em **GERAR LINK**
4. Um link curto como `https://meu-site.netlify.app/r/abc123` vai aparecer
5. Clique em **ENVIAR NO WHATSAPP** 🎉

---

## Dica: Domínio personalizado (opcional)
No Netlify → **Domain settings** → você pode adicionar um domínio próprio como `link.seusite.com.br` para ficar ainda mais profissional.

---

## Problemas comuns

**"Erro ao gerar link"** → Verifique se colou corretamente o `firebaseConfig` no `index.html`

**Redirect não funciona** → Verifique se as 3 variáveis de ambiente estão corretas no Netlify e fez um novo deploy

**"Link não encontrado"** → O código da URL pode ter expirado ou o Firestore ainda não foi criado
