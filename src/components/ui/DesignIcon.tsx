import icon0 from '../../assets/figma/perfil.svg'
import icon1 from '../../assets/figma/resumo-colmeias.svg'
import icon2 from '../../assets/figma/resumo-apiarios.svg'
import icon3 from '../../assets/figma/resumo-producao.svg'
import icon4 from '../../assets/figma/resumo-alertas.svg'
import icon5 from '../../assets/figma/tendencia.svg'
import icon6 from '../../assets/figma/inicio-ativo.svg'
import icon7 from '../../assets/figma/apiarios.svg'
import icon8 from '../../assets/figma/colmeias.svg'
import icon9 from '../../assets/figma/alertas.svg'
import icon10 from '../../assets/figma/producao.svg'
import icon11 from '../../assets/figma/inicio.svg'
import icon12 from '../../assets/figma/apiarios-ativo.svg'
import icon13 from '../../assets/figma/colmeias-ativo.svg'
import icon14 from '../../assets/figma/alertas-ativo.svg'
import icon15 from '../../assets/figma/producao-ativo.svg'
import icon16 from '../../assets/figma/status-normal.svg'
import icon17 from '../../assets/figma/status-atencao.svg'
import icon18 from '../../assets/figma/status-critico.svg'
import icon19 from '../../assets/figma/trofeu-ouro.svg'
import icon20 from '../../assets/figma/trofeu-prata.svg'
import icon21 from '../../assets/figma/trofeu-bronze.svg'
import styles from './DesignIcon.module.css'

const icons = {
  'perfil': icon0,
  'resumo-colmeias': icon1,
  'resumo-apiarios': icon2,
  'resumo-producao': icon3,
  'resumo-alertas': icon4,
  'tendencia': icon5,
  'inicio-ativo': icon6,
  'apiarios': icon7,
  'colmeias': icon8,
  'alertas': icon9,
  'producao': icon10,
  'inicio': icon11,
  'apiarios-ativo': icon12,
  'colmeias-ativo': icon13,
  'alertas-ativo': icon14,
  'producao-ativo': icon15,
  'status-normal': icon16,
  'status-atencao': icon17,
  'status-critico': icon18,
  'trofeu-ouro': icon19,
  'trofeu-prata': icon20,
  'trofeu-bronze': icon21,
}

export type DesignIconName = keyof typeof icons

/** Ícones do protótipo, preservados no tamanho original de exportação. */
export function DesignIcon({ name, className }: { name: DesignIconName; className?: string }) {
  return (
    <span className={[styles.icon, className].filter(Boolean).join(' ')} aria-hidden="true">
      <img src={icons[name]} alt="" />
    </span>
  )
}
