# Publicação do frontend no Firebase Hosting

O Hosting publica somente os arquivos do frontend/PWA. O login usa Firebase
Authentication e os cadastros são enviados à API Java em
https://abeia-api.onrender.com/api, configurada em `.env.production`.
A API valida a sessão e acessa o Realtime Database do usuário.

## Publicar

Com Node compatível com as dependências do projeto e Firebase CLI instalados:

```powershell
npm ci
firebase login
firebase deploy --only hosting --project abeia-cc22d
```

O comando executa o build antes de publicar `dist`. Não publica regras do banco,
Cloud Functions nem o backend Java. A conta Google usada no CLI precisa ter
permissão de publicação no projeto `abeia-cc22d`.

O endereço do aplicativo é https://abeia-cc22d.web.app. As rotas do aplicativo
abrem `index.html`, inclusive quando `/apiarios` ou `/perfil` são acessadas
diretamente. O layout mobile, manifest e service worker do PWA são mantidos.

## Verificar

1. Confirme que https://abeia-api.onrender.com/health responde antes de publicar.
2. Abra o aplicativo e entre em sua conta.
3. Crie um apiário, recarregue e confira o mesmo registro em outro dispositivo.
4. Confira o acesso direto a `/apiarios` e `/perfil`.
5. Feche e reabra o PWA para receber uma atualização já publicada.

Contas autenticadas usam a API Java. Sem login, o modo de demonstração salva
somente no navegador. Uma falha de rede da API não aciona demonstração automática.

Veja PUBLICACAO-RENDER.md para a publicação do backend e o acesso ao Swagger.
