package br.unifor.abeia.repository;

import br.unifor.abeia.model.Colmeia;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Repositório em memória para persistência de Colmeias.
 */
@Repository
public class ColmeiaRepository {

    private final Map<String, Colmeia> dados = new ConcurrentHashMap<>();

    public ColmeiaRepository() {
        salvar(new Colmeia(
                "j14", "Colmeia J14", "mata-fresca", "Langstroth", "14",
                "12/08/2021", "", "atencao", "Dentro do prazo",
                "Inspeção dentro do prazo", 58.0, List.of("Varroa em nível leve.")
        ));
        salvar(new Colmeia(
                "d03", "Colmeia D03", "sabia", "Langstroth", "07",
                "05/03/1967", "Caixa revisada e em boas condições.", "normal", "Em 3 dias",
                "Inspeção daqui 3 dias", 72.0, List.of()
        ));
        salvar(new Colmeia(
                "k07", "Colmeia K07", "batalha", "Langstroth", "03",
                "20/01/2020", "", "critico", "Atrasada",
                "Inspeção atrasada", 31.0, List.of("Alta infestação de varroa.")
        ));
        salvar(new Colmeia(
                "e17", "Colmeia E17", "santo-antonio", "Langstroth", "17",
                "02/02/2022", "", "normal", "Em 2 dias",
                "Inspeção daqui 2 dias", 67.0, List.of()
        ));
        salvar(new Colmeia(
                "f10", "Colmeia F10", "sabia", "Langstroth", "10",
                "10/10/2019", "", "atencao", "Dentro do prazo",
                "Inspeção dentro do prazo", 44.0, List.of("Reserva de alimento baixa.")
        ));
    }

    public List<Colmeia> listarTodas() {
        return new ArrayList<>(dados.values());
    }

    public List<Colmeia> listarPorApiario(String apiarioId) {
        return dados.values().stream()
                .filter(c -> Objects.equals(c.getApiarioId(), apiarioId))
                .collect(Collectors.toList());
    }

    public Optional<Colmeia> buscarPorId(String id) {
        return Optional.ofNullable(dados.get(id));
    }

    public Colmeia salvar(Colmeia colmeia) {
        if (colmeia.getId() == null || colmeia.getId().isBlank()) {
            colmeia.setId(UUID.randomUUID().toString());
        }
        dados.put(colmeia.getId(), colmeia);
        return colmeia;
    }

    public boolean excluir(String id) {
        return dados.remove(id) != null;
    }

    public boolean existe(String id) {
        return dados.containsKey(id);
    }
}
