import { FileTextIcon, HexagonsIcon, HiveIcon, MegaphoneIcon } from '../../components/icons'
import { Columns, Screen, Stack } from '../../components/layout/Screen'
import { BarChart } from '../../components/ui/BarChart'
import { ListCard, ListStack } from '../../components/ui/ListCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { StatCard } from '../../components/ui/StatCard'
import { findApiario, findColmeia, inspecoesPendentes, producaoMensal, resumoInicio, usuario } from '../../data/mock'
import styles from './Inicio.module.css'

/** 4 - Tela de Início */
export function Inicio() {
  const primeiroNome = usuario.nome.split(' ')[0]
  const pendentes = inspecoesPendentes.map((id) => findColmeia(id)!)

  return (
    <Screen nav="inicio">
      <Stack gap={0}>
        <hgroup className={styles.greeting}>
          <h1>Olá, {primeiroNome}!</h1>
          <p>Resumo do seu apiário hoje.</p>
        </hgroup>

        <div className={styles.stats}>
          <Columns gap={20} rowGap={16}>
            <StatCard to="/apiarios" icon={<HexagonsIcon size={18} />} label="Apiários" value={resumoInicio.apiarios} />
            <StatCard to="/colmeias" icon={<HiveIcon size={18} />} label="Colmeias" value={resumoInicio.colmeias} />
            <StatCard to="/producao" icon={<FileTextIcon size={18} />} label="Produção" value={`${resumoInicio.producaoKg} kg`} />
            <StatCard to="/alertas" icon={<MegaphoneIcon size={18} />} label="Alertas" value={resumoInicio.alertas} />
          </Columns>
        </div>

        <section className={styles.section}>
          <SectionTitle action={{ label: 'Ver todas', to: '/colmeias' }}>Inspeções pendentes</SectionTitle>
          <ListStack gap={9}>
            {pendentes.map((c) => (
              <ListCard
                key={c.id}
                to={`/colmeias/${c.id}`}
                title={c.nome}
                subtitle={`${findApiario(c.apiarioId)?.nome} • ${c.prazoInspecao}`}
                status={c.status}
              />
            ))}
          </ListStack>
        </section>

        <section className={styles.section}>
          <SectionTitle>Evolução da produção</SectionTitle>
          <BarChart data={producaoMensal} label="Produção mensal em kg" />
        </section>
      </Stack>
    </Screen>
  )
}
