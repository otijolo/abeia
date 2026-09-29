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
  data/        Tipos e dados mockados (trocar por API depois)
  pages/       Uma pasta por área (auth, inicio, apiarios, colmeias, alertas, producao, perfil)
  styles/      Tokens de design (cores, raios, sombras) e estilos globais
  routes.tsx   Mapa de rotas
```

## Rotas (fluxo do protótipo)

| Tela | Rota |
| --- | --- |
| Título (splash → cadastro) | `/` |
| Cadastro / Login / Recuperação | `/cadastro`, `/login`, `/recuperar-senha` |
| Início | `/inicio` |
| Apiários / Novo / Detalhes / Editar | `/apiarios`, `/apiarios/novo`, `/apiarios/:id`, `/apiarios/:id/editar` |
| Colmeias / Nova / Detalhes / Editar | `/colmeias`, `/colmeias/nova`, `/colmeias/:id`, `/colmeias/:id/editar` |
| Histórico / Nova inspeção / Detalhe | `/colmeias/:id/inspecoes`, `/colmeias/:id/inspecoes/nova`, `/inspecoes/:id` |
| Alertas / Detalhe | `/alertas`, `/alertas/:id` |
| Produção / Registrar / Relatórios | `/producao`, `/producao/registrar`, `/relatorios` |
| Perfil / Alterar senha | `/perfil`, `/perfil/senha` |

O app usa rotas de histórico (BrowserRouter): ao hospedar, configure o servidor para
redirecionar rotas desconhecidas para `index.html`.
