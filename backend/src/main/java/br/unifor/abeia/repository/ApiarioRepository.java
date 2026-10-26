package br.unifor.abeia.repository;

import br.unifor.abeia.model.Apiario;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Repositório em memória para persistência de Apiários.
 */
@Repository
public class ApiarioRepository {

    private final Map<String, Apiario> dados = new ConcurrentHashMap<>();

    public ApiarioRepository() {
    }

    public void semearDadosIniciais() {
        salvar(new Apiario(
                "sabia", "Apiário Sabiá", "Juazeiro do Norte", "CE",
                "Área principal de produção", "Caatinga", true,
                "-3.8907...", "-38.3905...", "Acesso pela estrada lateral",
                12, "normal"
        ));
        salvar(new Apiario(
                "mata-fresca", "Apiário Mata Fresca", "Aracati", "CE",
                "Área de mata nativa", "Mata Atlântica", true,
                "-4.5617...", "-37.7695...", "",
                8, "atencao"
        ));
        salvar(new Apiario(
                "santo-antonio", "Apiário Santo Antônio", "Beberibe", "CE",
                "Área litorânea", "Restinga", false,
                "-4.1797...", "-38.1305...", "",
                15, "normal"
        ));
        salvar(new Apiario(
                "batalha", "Apiário Batalha", "Guaramiranga", "CE",
                "Área de serra", "Mata úmida", true,
                "-4.2625...", "-38.9322...", "",
                6, "critico"
        ));
    }

    public void limpar() {
        dados.clear();
    }

    public List<Apiario> listarTodos() {
        return new ArrayList<>(dados.values());
    }

    public Optional<Apiario> buscarPorId(String id) {
        return Optional.ofNullable(dados.get(id));
    }

    public Apiario salvar(Apiario apiario) {
        if (apiario.getId() == null || apiario.getId().isBlank()) {
            apiario.setId(UUID.randomUUID().toString());
        }
        dados.put(apiario.getId(), apiario);
        return apiario;
    }

    public boolean excluir(String id) {
        return dados.remove(id) != null;
    }

    public boolean existe(String id) {
        return dados.containsKey(id);
    }
}
