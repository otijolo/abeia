package br.unifor.abeia.repository;

import br.unifor.abeia.model.Producao;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Repositório em memória para persistência de Produções / Colheitas.
 */
@Repository
public class ProducaoRepository {

    private final Map<String, Producao> dados = new ConcurrentHashMap<>();

    public ProducaoRepository() {
        // Dados iniciais
        salvar(new Producao("p1", "d03", "10/10/2026", 72.0, "kg", "Colheita de mel silvestre"));
        salvar(new Producao("p2", "e17", "12/10/2026", 67.0, "kg", "Mel claro, boa qualidade"));
        salvar(new Producao("p3", "j14", "15/10/2026", 58.0, "kg", "Colheita padrão"));
    }

    public List<Producao> listarTodas() {
        return new ArrayList<>(dados.values());
    }

    public List<Producao> listarPorColmeia(String colmeiaId) {
        return dados.values().stream()
                .filter(p -> Objects.equals(p.getColmeiaId(), colmeiaId))
                .collect(Collectors.toList());
    }

    public Optional<Producao> buscarPorId(String id) {
        return Optional.ofNullable(dados.get(id));
    }

    public Producao salvar(Producao producao) {
        if (producao.getId() == null || producao.getId().isBlank()) {
            producao.setId(UUID.randomUUID().toString());
        }
        if (producao.getUnidade() == null || producao.getUnidade().isBlank()) {
            producao.setUnidade("kg");
        }
        dados.put(producao.getId(), producao);
        return producao;
    }

    public boolean excluir(String id) {
        return dados.remove(id) != null;
    }

    public boolean existe(String id) {
        return dados.containsKey(id);
    }
}
