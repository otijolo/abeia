# Publicação do backend Java

Estado: integração preparada e testada localmente; ainda não publicada no Render.

## Como funciona

O frontend mantém o layout mobile e o PWA. O login continua no Firebase Authentication.
As seis classes de serviço do frontend chamam a API Java com o Firebase ID token no
cabeçalho Authorization: Bearer. O Java confere a sessão pelo endpoint oficial
accounts:lookup e acessa usuarios/{uid} no Realtime Database usando esse mesmo token.
As regras existentes do Firebase continuam valendo. Não é necessária chave de conta
de serviço nem permissão administrativa no banco.

Controllers e services continuam tratando os mesmos endpoints e validações.
Os repositories agora usam FirebaseDatabase para persistir os registros, em vez de
ConcurrentHashMap. Reiniciar a API não apaga os dados. O caminho do perfil aceita
somente o UID autenticado. O Swagger possui o botão Authorize para informar um ID
token válido. Não use a senha no campo Authorize.

Sem login, o modo de demonstração continua usando mockStore. Com login, uma falha
na API é mostrada como erro; não é convertida em uma gravação local aparentemente
bem-sucedida. Contas novas começam sem cadastros de exemplo; dados existentes no
Firebase são mantidos. O controller de reset de demonstração fica desativado no
ambiente padrão.

## Verificação local

No diretório backend, execute `./mvnw.cmd clean verify` no Windows ou
`./mvnw clean verify` no Linux. Os testes exercitam os CRUDs de alertas, produção e
perfil, isolamento entre usuários, token inválido/ausente, CORS, indisponibilidade
do banco, contagem de colmeias e resumo de inspeção contra um Firebase simulado.
Depois, `java -jar target/backend-abeia-1.0.0.jar` inicia a API na porta 8088.

No frontend, `npm ci` e `npm run build` validam o projeto. Para desenvolvimento,
use VITE_API_URL=http://localhost:8088/api e `npm run dev`.

Também foi conferido um ciclo temporário de criar, consultar, editar e excluir um
apiário pela API Java contra o Firebase real na conta de teste, além da consulta
às seis áreas. O registro temporário foi removido.

## Configuração no Render

Use New Web Service, repositório https://github.com/otijolo/abeia,
branch feat/publicacao-render, Language Docker, Root Directory backend,
Dockerfile ./Dockerfile, região Virginia e plano Free. O render.yaml traz essa
configuração para uso como Blueprint. Não implante a main por engano.

O Java usa a variável PORT fornecida pelo Render, com 8088 como padrão local.
Health Check Path: /health. Swagger: /swagger-ui.html. OpenAPI: /api-docs.
Os valores públicos padrão de FIREBASE_DATABASE_URL e FIREBASE_API_KEY já apontam
para o projeto Abeia. ALLOWED_ORIGINS permite o domínio web.app, firebaseapp.com e
localhost:5173. Não inclua senha, refresh token nem conta de serviço no Git.

Depois que o serviço estiver saudável, configure VITE_API_URL com
https://ENDERECO-REAL.onrender.com/api no frontend e execute
`firebase deploy --only hosting --project abeia-cc22d`. Não publique o frontend
antes de confirmar o backend. Teste login, leitura, gravação, atualização de página
e o mesmo registro no Swagger. Feche e reabra o PWA para receber a atualização.

O plano gratuito do Render suspende o serviço após inatividade; o primeiro acesso
pode demorar. O banco continua no Firebase durante essa suspensão.

Nenhum commit ou push faz parte da preparação local. Antes de publicar, obter a
autorização do responsável para enviar somente a branch de publicação.
