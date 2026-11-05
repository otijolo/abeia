# abeia
Projeto focado em auxiliar apicultores com o gerenciamento de seus apiários e colmeias.

PWA em React + Vite + TypeScript, replicando as telas e o fluxo do protótipo no Figma.

## Rodando

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção (gera o service worker)
npm run preview  # serve o build em http://localhost:4173
```

## Estrutura

```
src/
  components/
    brand/     Logo, wordmark e avatar
    icons/     Ícones SVG
    layout/    Screen (cabeçalho + conteúdo + nav), AuthLayout, BottomNav, AppHeader
    ui/        Button, campos, Card, ListCard, StatusBadge, ChipGroup, BarChart, ConfirmDialog...
  data/        Tipos, opções de formulário, exemplos e funções de datas, coordenadas e produção
  pages/       Uma pasta por área (auth, inicio, apiarios, colmeias, alertas, producao, perfil)
  styles/      Tokens de design (cores, raios, sombras) e estilos globais
  routes.tsx   Mapa de rotas
```

## Rotas (fluxo do protótipo)

| Tela | Rota |
| --- | --- |
| Título (splash → login ou início) | `/` |
| Cadastro / Login / Recuperação | `/cadastro`, `/login`, `/recuperar-senha` |
| Início | `/inicio` |
| Apiários / Novo / Detalhes / Editar | `/apiarios`, `/apiarios/novo`, `/apiarios/:id`, `/apiarios/:id/editar` |
| Mapa dos apiários | `/mapa`, `/mapa?apiario=:id` |
| Colmeias / Nova / Detalhes / Editar | `/colmeias`, `/colmeias/nova`, `/colmeias/:id`, `/colmeias/:id/editar` |
| Histórico / Nova inspeção / Detalhe | `/colmeias/:id/inspecoes`, `/colmeias/:id/inspecoes/nova`, `/inspecoes/:id` |
| Alertas / Detalhe | `/alertas`, `/alertas/:id` |
| Novo / Editar alerta | `/alertas/novo`, `/alertas/:id/editar` |
| Produção / Registrar / Relatórios | `/producao`, `/producao/registrar`, `/relatorios` |
| Editar produção | `/producao/:id/editar` |
| Perfil / Alterar senha | `/perfil`, `/perfil/senha` |

O app usa rotas de histórico (BrowserRouter): ao hospedar, configure o servidor para
redirecionar rotas desconhecidas para `index.html`.

O mapa usa Leaflet e OpenStreetMap, com marcadores a partir das coordenadas dos
apiários retornados pela API. Coordenadas incompletas não geram marcadores.
O carregamento do mapa precisa de conexão com a internet.

## Integração e CRUD

O frontend atualizado inclui a base da `main` e as mudanças da branch
`inaxxestudo-wq-patch-Apiario-colmeia`, já incorporadas ao histórico da `main`.
Os CRUDs de alertas, produção e dados do perfil usam a API Java.
Consulte [o roteiro de integração e testes](docs/integracao-crud.md).

No Windows, abra dois terminais na pasta do projeto:

```powershell
# Terminal 1: API em http://localhost:8088
cd backend
.\mvnw.cmd spring-boot:run
```

```powershell
# Terminal 2: frontend (abra o endereço mostrado pelo Vite)
npm install
npm run dev
```

É necessário um JDK 17 ou superior. A primeira execução do Maven baixa suas
dependências. Para testar o backend: `cd backend` e `.\mvnw.cmd test`.

Firebase Authentication e Firebase Realtime Database são responsáveis pela autenticação
e persistência em nuvem das entidades (apiários, colmeias, inspeções, alertas, produções
e perfil). O backend Spring Boot em `backend/` permanece disponível como API REST com
auto-semeadura em memória e documentação Swagger em http://localhost:8088/swagger-ui.html.
O frontend também conta com modo de demonstração local para apresentações rápidas.
