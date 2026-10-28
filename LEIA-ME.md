# L2M Importações — passo a passo (pelo computador)

São 3 partes: criar o banco grátis (Firebase), gerar o app no GitHub e conectar.

## Parte 1 — Banco de dados grátis (Firebase) · uns 10 min

1. Entre em https://console.firebase.google.com com uma conta Google (de preferência da empresa).
2. **Criar projeto** → nome: `l2m-importacoes` → pode desativar o Google Analytics → Criar.
3. Menu lateral **Criação (Build) → Authentication** → Vamos começar → aba **Método de login** → **Anônimo** → Ativar → Salvar.
4. Menu **Criação → Firestore Database** → Criar banco de dados → local **southamerica-east1 (São Paulo)** → modo **produção** → Criar.
5. Ainda no Firestore, aba **Regras**: apague tudo, cole o conteúdo do arquivo `firestore.rules` (está neste zip) e clique em **Publicar**.
6. Clique na engrenagem ⚙ (Configurações do projeto) → role até **Seus apps** → ícone **</>** (Web) → apelido `processos` → Registrar.
   Vai aparecer um bloco `const firebaseConfig = { ... }`. **Copie esse bloco inteiro** e guarde (vai colar no app).

## Parte 2 — Gerar o app no GitHub

1. github.com → **+ → New repository** → nome `processos` → marque **Public** → Create.
   (Público é necessário para a versão de navegador ser grátis. No repositório fica só o código do app — os processos ficam no Firebase, protegidos pelo código da equipe.)
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Volte em **<> Code → uploading an existing file** → arraste tudo da pasta extraída (as pastas `www`, `assets`, `src` e os arquivos) → Commit changes.
4. Se a pasta `.github` não subir (Windows costuma pular): **Actions → set up a workflow yourself** → nome `build-apk.yml` → cole o conteúdo do arquivo `.github/workflows/build-apk.yml` (abra no Bloco de Notas) → Commit changes.
5. Aba **Actions**: espere o ✔ verde (5 a 8 min).
   - **APK para celular:** página do repositório → **Releases** → `L2M-Importacoes.apk`.
   - **Versão para computador (navegador):** `https://SEU-USUARIO.github.io/processos/`

## Parte 3 — Conectar e chamar a equipe

1. Abra o app (celular ou navegador) → ⚙ Configurações → coloque seu nome.
2. **Criar o banco (admin)** → cole o `firebaseConfig` da Parte 1 → **Conectar e gerar código**.
3. Clique em **Copiar código** e mande para quem vai usar (WhatsApp).
4. Cada pessoa: instala o APK (ou abre o link no computador) → ⚙ → coloca o nome → **Recebi um código** → cola → Conectar.

Pronto: tudo que alguém cadastrar ou mudar aparece em segundos para todos.
Se a internet cair, o app continua funcionando e envia quando voltar.

## Limites do plano grátis do Firebase
50 mil leituras, 20 mil gravações por dia e 1 GB de dados — sobra para uma equipe pequena.

## Problemas comuns
- **"Erro de conexão" / permission-denied:** confira se o login **Anônimo** está ativado e se as **Regras** foram publicadas.
- **Código inválido:** copie o código inteiro de novo (começa com `PROC1.`).
- **Alguém perdeu o acesso:** basta colar o código de novo; os dados ficam na nuvem.
- **Guarde o código da equipe em lugar seguro:** quem tiver o código vê e edita os processos.
