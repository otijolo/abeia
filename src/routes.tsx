import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router-dom'
import { AppFrame } from './components/layout/AppFrame'
import { AlertaDetalhes } from './pages/alertas/AlertaDetalhes'
import { Alertas } from './pages/alertas/Alertas'
import { NovoAlerta } from './pages/alertas/NovoAlerta'
import { ApiarioDetalhes } from './pages/apiarios/ApiarioDetalhes'
import { Apiarios } from './pages/apiarios/Apiarios'
import { EditarApiario } from './pages/apiarios/EditarApiario'
import { NovoApiario } from './pages/apiarios/NovoApiario'
import { Mapa } from './pages/apiarios/Mapa'
import { Cadastro } from './pages/auth/Cadastro'
import { Login } from './pages/auth/Login'
import { RecuperarSenha } from './pages/auth/RecuperarSenha'
import { Splash } from './pages/auth/Splash'
import { ColmeiaDetalhes } from './pages/colmeias/ColmeiaDetalhes'
import { Colmeias } from './pages/colmeias/Colmeias'
import { EditarColmeia } from './pages/colmeias/EditarColmeia'
import { HistoricoInspecoes } from './pages/colmeias/HistoricoInspecoes'
import { InspecaoDetalhes } from './pages/colmeias/InspecaoDetalhes'
import { NovaColmeia } from './pages/colmeias/NovaColmeia'
import { NovaInspecao } from './pages/colmeias/NovaInspecao'
import { Inicio } from './pages/inicio/Inicio'
import { NotFound } from './pages/NotFound'
import { AlterarSenha } from './pages/perfil/AlterarSenha'
import { Perfil } from './pages/perfil/Perfil'
import { Producao } from './pages/producao/Producao'
import { RegistrarProducao } from './pages/producao/RegistrarProducao'
import { Relatorios } from './pages/producao/Relatorios'

function Root() {
  return (
    <AppFrame>
      <Outlet />
      <ScrollRestoration />
    </AppFrame>
  )
}

/** Mapa de rotas — espelha o fluxo do protótipo no Figma */
export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // Autenticação
      { path: '/', element: <Splash /> },
      { path: '/cadastro', element: <Cadastro /> },
      { path: '/login', element: <Login /> },
      { path: '/recuperar-senha', element: <RecuperarSenha /> },

      // Início
      { path: '/inicio', element: <Inicio /> },

      // Apiários
      { path: '/apiarios', element: <Apiarios /> },
      { path: '/mapa', element: <Mapa /> },
      { path: '/apiarios/novo', element: <NovoApiario /> },
      { path: '/apiarios/:id', element: <ApiarioDetalhes /> },
      { path: '/apiarios/:id/editar', element: <EditarApiario /> },

      // Colmeias e inspeções
      { path: '/colmeias', element: <Colmeias /> },
      { path: '/colmeias/nova', element: <NovaColmeia /> },
      { path: '/colmeias/:id', element: <ColmeiaDetalhes /> },
      { path: '/colmeias/:id/editar', element: <EditarColmeia /> },
      { path: '/colmeias/:id/inspecoes', element: <HistoricoInspecoes /> },
      { path: '/colmeias/:id/inspecoes/nova', element: <NovaInspecao /> },
      { path: '/inspecoes/:id', element: <InspecaoDetalhes /> },

      // Alertas
      { path: '/alertas', element: <Alertas /> },
      { path: '/alertas/novo', element: <NovoAlerta /> },
      { path: '/alertas/:id', element: <AlertaDetalhes /> },

      // Produção
      { path: '/producao', element: <Producao /> },
      { path: '/producao/registrar', element: <RegistrarProducao /> },
      { path: '/relatorios', element: <Relatorios /> },

      // Perfil
      { path: '/perfil', element: <Perfil /> },
      { path: '/perfil/senha', element: <AlterarSenha /> },

      { path: '*', element: <NotFound /> },
    ],
  },
])
