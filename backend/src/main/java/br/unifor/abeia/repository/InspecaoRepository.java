package br.unifor.abeia.repository;

import br.unifor.abeia.model.Inspecao;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Repositório em memória para persistência de Inspeções.
 */
@Repository
public class InspecaoRepository {

    private final Map<String, Inspecao> dados = new ConcurrentHashMap<>();

    public InspecaoRepository() {
        semearDadosIniciais();
    }

    public void semearDadosIniciais() {
        salvar(new Inspecao(
                "i-2026-11-17", "d03", "17/11/2026", "Colônia forte • Sem problemas",
                "normal", "Forte", true, 6, 4, "Boa", List.of(),
                "Colônia ativa, alimentação adequada e comportamento normal."
        ));
        salvar(new Inspecao(
                "i-2026-10-04", "d03", "04/10/2026", "Infestação moderada",
                "critico", "Média", true, 5, 3, "Padrão",
                List.of("Infestação moderada de varroa."), "Manejo sanitário realizado."
        ));
        salvar(new Inspecao(
                "i-2026-10-01", "d03", "01/10/2026", "Rainha observada • Varroa leve",
                "atencao", "Média", true, 5, 4, "Padrão",
                List.of("Varroa leve."), "Acompanhar na próxima inspeção."
        ));
        salvar(new Inspecao(
                "i-2026-10-15-k07", "k07", "15/10/2026", "Colônia fraca • Rainha não observada",
                "critico", "Fraca", false, 2, 1, "Ruim",
                List.of("Alta infestação de varroa."), "Rainha não localizada, alta infestação de ácaros nos favos."
        ));
        salvar(new Inspecao(
                "i-2026-09-20-k07", "k07", "20/09/2026", "Varroa em início de proliferação",
                "atencao", "Média", true, 4, 2, "Padrão",
                List.of("Varroa leve."), "Início de infestação notado nos quadros periféricos."
        ));
        salvar(new Inspecao(
                "i-2026-10-14-j14", "j14", "14/10/2026", "Colônia média • Rainha observada",
                "atencao", "Média", true, 5, 4, "Boa",
                List.of("Varroa em nível leve."), "Colônia com boa dinâmica, pequenos focos de ácaros."
        ));
        salvar(new Inspecao(
                "i-2026-10-12-e17", "e17", "12/10/2026", "Colônia forte • Excelente postura",
                "normal", "Forte", true, 7, 5, "Boa",
                List.of(), "Excelente postura e reserva de mel abundante."
        ));
        salvar(new Inspecao(
                "i-2026-10-08-f10", "f10", "08/10/2026", "Reserva de alimento baixa",
                "atencao", "Média", true, 4, 3, "Padrão",
                List.of(), "Quadros de reserva de mel quase vazios. Fornecer alimentação artificial."
        ));
    }

    public void limpar() {
        dados.clear();
    }

    public List<Inspecao> listarTodas() {
        return new ArrayList<>(dados.values());
    }

    public List<Inspecao> listarPorColmeia(String colmeiaId) {
        return dados.values().stream()
                .filter(i -> Objects.equals(i.getColmeiaId(), colmeiaId))
                .sorted((a, b) -> b.getData().compareTo(a.getData()))
                .collect(Collectors.toList());
    }

    public Optional<Inspecao> buscarPorId(String id) {
        return Optional.ofNullable(dados.get(id));
    }

    public Inspecao salvar(Inspecao inspecao) {
        if (inspecao.getId() == null || inspecao.getId().isBlank()) {
            inspecao.setId(UUID.randomUUID().toString());
        }
        dados.put(inspecao.getId(), inspecao);
        return inspecao;
    }

    public boolean excluir(String id) {
        return dados.remove(id) != null;
    }
}
