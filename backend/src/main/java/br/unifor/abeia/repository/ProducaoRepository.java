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
        semearDadosIniciais();
    }

    public void semearDadosIniciais() {
        salvar(new Producao("p1", "d03", "10/10/2026", 72.0, "kg", "Colheita de mel silvestre"));
        salvar(new Producao("p2", "e17", "12/10/2026", 67.0, "kg", "Mel claro, boa qualidade"));
        salvar(new Producao("p3", "j14", "15/10/2026", 58.0, "kg", "Colheita padrão com favos bem operculados"));
        salvar(new Producao("p4", "f10", "20/09/2026", 44.0, "kg", "Melgueira suplementar colhida"));
        salvar(new Producao("p5", "d03", "18/08/2026", 54.0, "kg", "Mel de florada de marmeleiro"));
        salvar(new Producao("p6", "e17", "05/07/2026", 62.0, "kg", "Colheita de inverno"));
        salvar(new Producao("p7", "j14", "22/06/2026", 48.0, "kg", "Segunda colheita da estação"));
        salvar(new Producao("p8", "d03", "15/05/2026", 57.0, "kg", "Mel multifloral claro"));
        salvar(new Producao("p9", "e17", "10/04/2026", 65.0, "kg", "Safra excelente pós-chuvas"));
        salvar(new Producao("p10", "k07", "12/03/2026", 43.0, "kg", "Primeira colheita do ano"));
        salvar(new Producao("p11", "f10", "25/02/2026", 48.0, "kg", "Mel denso e encorpado"));
        salvar(new Producao("p12", "d03", "18/01/2026", 22.0, "kg", "Colheita de início de safra"));
    }

    public void limpar() {
        dados.clear();
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
