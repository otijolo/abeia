import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'

function cliente({ usuario = null, demo = false, falhaDeRede = false } = {}) {
  const chamadas = []
  let codigo = readFileSync(new URL('../src/services/api.ts', import.meta.url), 'utf8')
    .replace(/^import [^\r\n]*\r?\n/gm, '')
    .replace('import.meta.env.VITE_API_URL', JSON.stringify('https://api.example/api'))
    .replace(/export /g, '')
  codigo = stripTypeScriptTypes(codigo, { mode: 'transform' }) + '\n;({ apiFetch, ApiError })'
  const api = runInNewContext(codigo, {
    auth: { currentUser: usuario, authStateReady: async () => {} },
    sessionStorage: { getItem: () => demo ? '1' : null },
    handleLocalMockRequest: async (endpoint) => {
      chamadas.push({ tipo: 'demo', endpoint })
      return []
    },
    Headers,
    AbortSignal,
    fetch: async (url, options) => {
      chamadas.push({ tipo: 'api', url, options })
      if (falhaDeRede) throw new Error('offline')
      return { ok: true, status: 200, json: async () => [] }
    }
  })
  return { ...api, chamadas }
}

const usuario = { getIdToken: async () => 'token-do-usuario' }

test('conta autenticada usa a API e envia o token, sem usar demonstração', async () => {
  const c = cliente({ usuario })
  await c.apiFetch('/apiarios')
  assert.equal(c.chamadas.length, 1)
  assert.equal(c.chamadas[0].tipo, 'api')
  assert.equal(c.chamadas[0].options.headers.get('Authorization'), 'Bearer token-do-usuario')
})

test('demonstração explícita nunca acessa a API, mesmo se outra aba autenticar', async () => {
  const c = cliente({ usuario, demo: true })
  await c.apiFetch('/colmeias', { method: 'POST', body: '{}' })
  assert.equal(c.chamadas.length, 1)
  assert.equal(c.chamadas[0].tipo, 'demo')
})

test('sessão encerrada não vira demonstração automaticamente', async () => {
  const c = cliente()
  await assert.rejects(c.apiFetch('/apiarios'), error => error.status === 401)
  assert.equal(c.chamadas.length, 0)
})

test('falha da API não grava no armazenamento de demonstração', async () => {
  const c = cliente({ usuario, falhaDeRede: true })
  await assert.rejects(c.apiFetch('/colmeias', { method: 'POST', body: '{}' }), /servidor/)
  assert.equal(c.chamadas.length, 1)
  assert.equal(c.chamadas[0].tipo, 'api')
})
