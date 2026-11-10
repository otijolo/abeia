import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { AppIcon } from '../components/brand/Brand'
import { Button } from '../components/ui/Button'
import { AlertBanner } from '../components/ui/AlertBanner'

export function RootErrorBoundary() {
  const error = useRouteError()

  let errorMessage = 'Ocorreu um erro inesperado no aplicativo.'
  let errorDetails = ''

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} - ${error.statusText || 'Página não encontrada'}`
    errorDetails = typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2)
  } else if (error instanceof Error) {
    errorMessage = error.message
    errorDetails = error.stack || ''
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'var(--color-bg, #f7f7f5)',
        fontFamily: 'var(--font, sans-serif)',
        color: 'var(--color-text, #000)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e2e2',
          padding: '32px 24px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px'
        }}
      >
        <AppIcon size={64} />

        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
          Ops! Algo não saiu como esperado
        </h1>

        <p style={{ fontSize: '14px', color: '#7f7c70', margin: 0, lineHeight: 1.4 }}>
          Não foi possível carregar esta tela. Tente voltar para o início ou recarregar a página.
        </p>

        <div style={{ width: '100%', textAlign: 'left', marginTop: '4px' }}>
          <AlertBanner variant="error" title="Detalhes do erro">
            {errorMessage}
          </AlertBanner>
        </div>

        {errorDetails && (
          <details
            style={{
              width: '100%',
              textAlign: 'left',
              fontSize: '11px',
              color: '#7f7c70',
              background: '#f9f9f8',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e8e8e6',
              overflowX: 'auto',
              maxHeight: '160px'
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Informações técnicas</summary>
            <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {errorDetails}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
          <Button onClick={() => (window.location.href = '/inicio')}>
            Ir para o Início
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Recarregar página
          </Button>
        </div>
      </div>
    </div>
  )
}
