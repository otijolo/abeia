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
