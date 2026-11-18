import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { router } from './routes'
import './styles/global.css'

let atualizacaoPendente = false

function aplicarAtualizacao() {
  // Não recarrega uma tela de formulário enquanto o usuário preenche os campos.
  const telasDeConsulta = ['/inicio', '/apiarios', '/colmeias', '/alertas', '/producao', '/mapa', '/relatorios']
  if (atualizacaoPendente && router.state.navigation.state === 'idle'
      && telasDeConsulta.includes(router.state.location.pathname)) {
    window.location.reload()
  }
}

registerSW({
  immediate: true,
  onNeedReload() {
    atualizacaoPendente = true
    aplicarAtualizacao()
  },
  onRegisteredSW(_url, registro) {
    if (!registro) return
    const verificar = () => {
      aplicarAtualizacao()
      if (navigator.onLine) void registro.update().catch(() => {})
    }
    window.addEventListener('focus', verificar)
    verificar()
  }
})

router.subscribe(aplicarAtualizacao)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
