# Publicação do frontend no Firebase Hosting

Esta pasta contém a versão do ZIP recebido em 15/11/2026, preparada para publicar
somente o frontend. O login e os seis cadastros usam o Firebase diretamente quando
o usuário está autenticado. Não é necessário executar o backend Java para esses fluxos.

## Publicar

Com Node compatível com as dependências do projeto e Firebase CLI instalados:

```powershell
npm ci
firebase login
firebase deploy --only hosting --project abeia-cc22d
```

O comando executa o build automaticamente antes de publicar a pasta `dist`.
Não publica regras do banco nem Cloud Functions. A conta Google usada no CLI
precisa ter permissão de publicação no projeto `abeia-cc22d`.

O Hosting configura todas as rotas do aplicativo para abrir `index.html`, inclusive
quando `/apiarios`, `/perfil` ou outra tela for aberta diretamente pelo navegador.

## Ajuste incluído nesta preparação

A inicialização de dados de exemplo em `firebaseSync.ts` passa a ocorrer somente
se não existir dado algum para o usuário. Excluir todos os apiários não deve
recriar exemplos nem substituir perfil, colheitas, inspeções ou alertas existentes.

## Verificar

1. Abra o endereço retornado pelo comando de publicação e entre em sua conta.
2. Crie um apiário, recarregue a página e confirme que ele continua cadastrado.
3. Abra a mesma conta em outro navegador ou celular e confira o registro.
4. Confira também o acesso direto a uma rota como `/apiarios`.

O backend Java contido no ZIP continua separado. Não é compilado nem publicado por
esta configuração de Hosting, e seus endpoints Swagger não ganham persistência
Firebase automaticamente.
