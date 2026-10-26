import { useEffect, useState } from 'react'
import { FileTextIcon, HexagonsIcon, HiveIcon, MegaphoneIcon } from '../../components/icons'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { BarChart } from '../../components/ui/BarChart'
import { EmptyState } from '../../components/ui/EmptyState'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatCard } from '../../components/ui/StatCard'
import { findApiario } from '../../data/mock'
import { auth } from '../../services/firebase'
import { listarApiarios } from '../../services/apiarioService'
import { listarColmeias } from '../../services/colmeiaService'
import { listarProducoes } from '../../services/producaoService'
import { listarAlertas } from '../../services/alertaService'
import { buscarPerfil } from '../../services/perfilService'
import type { Apiario, Colmeia, ProducaoMensal } from '../../data/types'
import styles from './Inicio.module.css'

const MESES_INICIAIS: ProducaoMensal[] = [
  { mes: 'Jan', kg: 0 },
  { mes: 'Fev', kg: 0 },
  { mes: 'Mar', kg: 0 },
  { mes: 'Abr', kg: 0 },
  { mes: 'Mai', kg: 0 },
  { mes: 'Jun', kg: 0 },
  { mes: 'Jul', kg: 0 },
  { mes: 'Ago', kg: 0 },
  { mes: 'Set', kg: 0 },
  { mes: 'Out', kg: 0 },
  { mes: 'Nov', kg: 0 },
  { mes: 'Dez', kg: 0 },
]

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
  const [dadosGrafico, setDadosGrafico] = useState<ProducaoMensal[]>(MESES_INICIAIS)

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
          (acc, p) => acc + (Number(p.quantidade) || 0),
          0
        )
        setTotalProducaoKg(Math.round(somaKg))

        // Alertas ativos
        const ativos = alertas.filter((a) => a.estado === 'ativo').length
        setTotalAlertas(ativos)

        // Gráfico de evolução da produção mensal
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        const porMes = meses.map((mes) => ({ mes, kg: 0 }))
        producoes.forEach((p) => {
          if (!p.data) return
          let mIndex = -1
          if (p.data.includes('-')) {
            const partes = p.data.split('-')
            mIndex = parseInt(partes[1], 10) - 1
          } else if (p.data.includes('/')) {
            const partes = p.data.split('/')
            mIndex = parseInt(partes[1], 10) - 1
          }
          if (mIndex >= 0 && mIndex < 12) {
            porMes[mIndex].kg += Number(p.quantidade) || 0
          }
        })
        setDadosGrafico(porMes)
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
              icon={<HexagonsIcon size={18} />}
              label="Apiários"
              value={totalApiarios}
            />
            <StatCard
              to="/colmeias"
              icon={<HiveIcon size={18} />}
              label="Colmeias"
              value={totalColmeias}
            />
            <StatCard
              to="/producao"
              icon={<FileTextIcon size={18} />}
              label="Produção"
              value={`${totalProducaoKg} kg`}
            />
            <StatCard
              to="/alertas"
              icon={<MegaphoneIcon size={18} />}
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

        <section className={styles.section}>
          <SectionTitle>Evolução da produção</SectionTitle>
          <BarChart data={dadosGrafico} label="Produção mensal em kg" />
        </section>
      </Stack>
    </Screen>
  )
}
