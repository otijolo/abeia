import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerUrl from '../../assets/figma/marcador.svg'
import { Screen } from '../../components/layout/Screen'
import { Button } from '../../components/ui/Button'
import { InfoCard } from '../../components/ui/InfoCard'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { coordenadasDoApiario } from '../../data/coordenadas'
import type { Apiario } from '../../data/types'
import { listarApiarios } from '../../services/apiarioService'
import styles from './Mapa.module.css'

/** Mapa dos apiários; o marcador abre os detalhes sem sair da tela. */
export function Mapa() {
  const [params] = useSearchParams()
  const apiarioId = params.get('apiario')
  const containerRef = useRef<HTMLDivElement>(null)
  const [apiarios, setApiarios] = useState<Apiario[]>([])
  const [selecionado, setSelecionado] = useState<Apiario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [erroMapa, setErroMapa] = useState(false)

  useEffect(() => {
    let ativo = true
    listarApiarios()
      .then((dados) => {
        if (!ativo) return
        setApiarios(dados)
        setSelecionado(dados.find((a) => a.id === apiarioId) ?? null)
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar os apiários.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => { ativo = false }
  }, [apiarioId])

  useEffect(() => {
    if (!containerRef.current) return
    const map = L.map(containerRef.current, { scrollWheelZoom: false })
      .setView([-5.5, -39.3], 7)
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)
    tiles.on('tileerror', () => setErroMapa(true))
    tiles.on('load', () => {
      if (containerRef.current?.querySelector('.leaflet-tile-loaded')) setErroMapa(false)
    })

    const icon = L.icon({ iconUrl: markerUrl, iconSize: [40, 50], iconAnchor: [20, 50] })
    const pontos: [number, number][] = []
    apiarios.forEach((apiario) => {
      const ponto = coordenadasDoApiario(apiario)
      if (!ponto) return
      pontos.push(ponto)
      L.marker(ponto, { icon, title: apiario.nome, alt: apiario.nome })
        .addTo(map)
        .on('click', () => setSelecionado(apiario))
    })

    const escolhido = apiarios.find((a) => a.id === apiarioId)
    const centro = escolhido && coordenadasDoApiario(escolhido)
    if (centro) map.setView(centro, 12)
    else if (pontos.length) map.fitBounds(L.latLngBounds(pontos), { padding: [40, 60], maxZoom: 12 })

    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
      map.remove()
    }
  }, [apiarios, apiarioId])

  const semLocalizacao = apiarios.filter((a) => !coordenadasDoApiario(a)).length

  return (
    <Screen title="Mapa" nav="apiarios" padding="none" backTo="/apiarios">
      <div className={styles.viewport}>
        <div ref={containerRef} className={styles.map} aria-label="Localização dos apiários" />
        {(carregando || erro || erroMapa || semLocalizacao > 0 || apiarios.length === 0) && (
          <p className={styles.notice} role="status">
            {carregando ? 'Carregando apiários...' : erro || (erroMapa
              ? 'Não foi possível carregar o mapa. Confira sua conexão.'
              : semLocalizacao > 0
                ? `${semLocalizacao} apiário(s) sem coordenadas válidas. Atualize a localização nos detalhes.`
                : 'Nenhum apiário cadastrado.')}
          </p>
        )}
        {selecionado && (
          <section className={styles.details} aria-label="Apiário selecionado">
            <InfoCard title={selecionado.nome} lines={[
              `${selecionado.cidade} - ${selecionado.uf}`,
              `${selecionado.totalColmeias} colmeias cadastradas`,
            ]}>
              <div className={styles.actions}>
                <StatusBadge status={selecionado.status} />
                <button type="button" className={styles.close} onClick={() => setSelecionado(null)}>
                  Fechar
                </button>
              </div>
              <Button to={`/apiarios/${selecionado.id}`}>Ver detalhes</Button>
            </InfoCard>
          </section>
        )}
      </div>
    </Screen>
  )
}
