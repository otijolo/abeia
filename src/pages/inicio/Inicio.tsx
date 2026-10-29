import { useEffect, useState } from 'react'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { DesignIcon } from '../../components/ui/DesignIcon'
import { EmptyState } from '../../components/ui/EmptyState'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatCard } from '../../components/ui/StatCard'
import { findApiario } from '../../data/mock'
import { auth } from '../../services/firebase'
import { quantidadeEmKg } from '../../data/producao'
import { listarApiarios } from '../../services/apiarioService'
import { listarColmeias } from '../../services/colmeiaService'
import { listarProducoes } from '../../services/producaoService'
import { listarAlertas } from '../../services/alertaService'
import { buscarPerfil } from '../../services/perfilService'
import type { Apiario, Colmeia } from '../../data/types'
import styles from './Inicio.module.css'

/** 4 - Tela de Início */
export function Inicio() {
  const [nome, setNome] = useState<string>(() => {
    return (
      localStorage.getItem('abeia_nome') ||
      auth.currentUser?.displayName ||
      (auth.currentUser?.email ? auth.currentUser.email.split('@')[0] : '') ||
      'Produtor'
    )
  })
  const [totalApiarios, setTotalApiarios] = useState(0)
  const [totalColmeias, setTotalColmeias] = useState(0)
  const [totalProducaoKg, setTotalProducaoKg] = useState(0)
  const [totalAlertas, setTotalAlertas] = useState(0)
  const [colmeiasPendentes, setColmeiasPendentes] = useState<Colmeia[]>([])
  const [apiariosMap, setApiariosMap] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      try {
        const [apiarios, colmeias, producoes, alertas, perfil] = await Promise.all([
          listarApiarios().catch(() => []),
          listarColmeias().catch(() => []),
          listarProducoes().catch(() => []),
          listarAlertas().catch(() => []),
          buscarPerfil().catch(() => null)
        ])

        if (!ativo) return

        if (perfil?.nome) {
          setNome(perfil.nome)
          localStorage.setItem('abeia_nome', perfil.nome)
          if (perfil.iniciais) {
            localStorage.setItem('abeia_iniciais', perfil.iniciais)
          }
        } else {
          const nomeAuth =
            auth.currentUser?.displayName ||
            (auth.currentUser?.email ? auth.currentUser.email.split('@')[0] : '')
          if (nomeAuth) {
            setNome(nomeAuth)
            localStorage.setItem('abeia_nome', nomeAuth)
          }
        }

        // Apiários
        setTotalApiarios(apiarios.length)
        const map = new Map<string, string>()
        apiarios.forEach((a: Apiario) => map.set(a.id, a.nome))
        setApiariosMap(map)

        // Colmeias
        setTotalColmeias(colmeias.length)
        const pendentes = colmeias.filter(
          (c) => c.status === 'critico' || c.status === 'atencao'
        )
        setColmeiasPendentes(
          pendentes.length > 0 ? pendentes.slice(0, 4) : colmeias.slice(0, 4)
        )

        // Produção total em kg
        const somaKg = producoes.reduce(
          (acc, p) => acc + quantidadeEmKg(p),
          0
        )
        setTotalProducaoKg(somaKg)

        // Alertas ativos
        const ativos = alertas.filter((a) => a.estado === 'ativo').length
        setTotalAlertas(ativos)
      } catch (err) {
        console.error('Erro ao sincronizar dashboard de início:', err)
      }
    }

    void carregarDados()

    return () => {
      ativo = false
    }
  }, [])

  const primeiroNome = (nome || 'Produtor').split(' ')[0]

  return (
    <Screen nav="inicio">
      <Stack gap={0}>
        <hgroup className={styles.greeting}>
          <h1>Olá, {primeiroNome}!</h1>
          <p>Resumo do seu apiário hoje.</p>
        </hgroup>

        <div className={styles.stats}>
          <Columns gap={20} rowGap={16}>
            <StatCard
              to="/apiarios"
              icon={<DesignIcon name="resumo-apiarios" />}
              label="Apiários"
              value={totalApiarios}
            />
            <StatCard
              to="/colmeias"
              icon={<DesignIcon name="resumo-colmeias" />}
              label="Colmeias"
              value={totalColmeias}
            />
            <StatCard
              to="/producao"
              icon={<DesignIcon name="resumo-producao" />}
              label="Produção"
              indicator={<DesignIcon name="tendencia" className={styles.trend} />}
              value={`${totalProducaoKg.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`}
            />
            <StatCard
              to="/alertas"
              icon={<DesignIcon name="resumo-alertas" />}
              label="Alertas"
              value={totalAlertas}
            />
          </Columns>
        </div>

        <section className={styles.section}>
          <SectionTitle action={{ label: 'Ver todas', to: '/colmeias' }}>
            Inspeções pendentes
          </SectionTitle>
          <ListStack gap={9}>
            {colmeiasPendentes.length > 0 ? (
              colmeiasPendentes.map((c) => {
                const nomeApiario =
                  apiariosMap.get(c.apiarioId) ||
                  findApiario(c.apiarioId)?.nome ||
                  'Apiário'
                return (
                  <ListCard
                    key={c.id}
                    to={`/colmeias/${c.id}`}
                    title={c.nome}
                    subtitle={`${nomeApiario} • ${c.prazoInspecao || 'Inspeção pendente'}`}
                    status={c.status}
                  />
                )
              })
            ) : (
              <EmptyState>Nenhuma inspeção pendente no momento.</EmptyState>
            )}
          </ListStack>
        </section>
      </Stack>
    </Screen>
  )
}
