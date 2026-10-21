package br.unifor.abeia.repository;

import br.unifor.abeia.model.Alerta;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Repositório em memória para persistência de Alertas.
 */
@Repository
public class AlertaRepository {

    private final Map<String, Alerta> dados = new ConcurrentHashMap<>();

    public AlertaRepository() {
        // Dados iniciais pré-cadastrados para teste
        salvar(new Alerta(
                "varroa-k07",
                "Alta infestação de varroa",
                "Possível infestação de varroa",
                "Colmeia K07",
                "Há 2 dias",
                "17/11/2026",
                "critico",
                "ativo",
                "A inspeção identificou sinais compatíveis com varroa em nível alto. Recomenda-se revisar a colmeia e registrar uma nova inspeção após o manejo.",
                List.of("Apiário Batalha: Colmeia K07"),
                "k07"
        ));
        salvar(new Alerta(
                "prazo-j14",
                "Prazo de inspeção acabando",
                "Prazo de inspeção acabando",
                "Colmeia J14",
                "Há 3 dias",
                "16/11/2026",
                "atencao",
                "ativo",
                "A próxima inspeção da colmeia vence nos próximos dias.",
                List.of("Apiário Mata Fresca: Colmeia J14"),
                "j14"
        ));
        salvar(new Alerta(
                "producao-mata-fresca",
                "Produção abaixo do esperado",
                "Produção abaixo do esperado",
                "Apiário Mata Fresca",
                "Há 5 dias",
                "14/11/2026",
                "atencao",
                "ativo",
                "A produção do apiário no período ficou abaixo da média dos últimos meses.",
                List.of("Apiário Mata Fresca"),
                null
        ));
    }

    public List<Alerta> listarTodos() {
        return new ArrayList<>(dados.values());
    }

    public Optional<Alerta> buscarPorId(String id) {
        return Optional.ofNullable(dados.get(id));
    }

    public Alerta salvar(Alerta alerta) {
        if (alerta.getId() == null || alerta.getId().isBlank()) {
            alerta.setId(UUID.randomUUID().toString());
        }
        if (alerta.getEstado() == null || alerta.getEstado().isBlank()) {
            alerta.setEstado("ativo");
        }
        dados.put(alerta.getId(), alerta);
        return alerta;
    }

    public boolean excluir(String id) {
        return dados.remove(id) != null;
    }

    public boolean existe(String id) {
        return dados.containsKey(id);
    }
}
