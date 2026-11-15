package br.unifor.abeia.repository;

import br.unifor.abeia.model.Apiario;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Repositório de Apiario no Firebase, separado por usuário.
 */
@Repository
public class ApiarioRepository {

    private final FirebaseDatabase database;

    public ApiarioRepository(FirebaseDatabase database) {
        this.database = database;
    }

    public void semearDadosIniciais() {
        salvar(new Apiario(
                "sabia", "Apiário Sabiá", "Juazeiro do Norte", "CE",
                "Área principal de produção", "Caatinga", true,
                "-7.2130", "-39.3150", "Acesso pela estrada lateral",
                12, "normal"
        ));
        salvar(new Apiario(
                "mata-fresca", "Apiário Mata Fresca", "Aracati", "CE",
                "Área de mata nativa", "Mata Atlântica", true,
                "-4.5617", "-37.7695", "",
                8, "atencao"
        ));
        salvar(new Apiario(
                "santo-antonio", "Apiário Santo Antônio", "Beberibe", "CE",
                "Área litorânea", "Restinga", false,
                "-4.1797", "-38.1305", "",
                15, "normal"
        ));
        salvar(new Apiario(
                "batalha", "Apiário Batalha", "Guaramiranga", "CE",
                "Área de serra", "Mata úmida", true,
                "-4.2625", "-38.9322", "",
                6, "critico"
        ));
    }

    public void limpar() {
        database.excluir("apiarios");
    }

    public List<Apiario> listarTodos() {
        return database.listar("apiarios", Apiario.class);
    }

    public Optional<Apiario> buscarPorId(String id) {
        return database.buscar("apiarios/" + id, Apiario.class);
    }

    public Apiario salvar(Apiario apiario) {
        if (apiario.getId() == null || apiario.getId().isBlank()) {
            apiario.setId(UUID.randomUUID().toString());
        }
        database.salvar("apiarios/" + apiario.getId(), apiario);
        return apiario;
    }

    public boolean excluir(String id) {
        return database.excluir("apiarios/" + id);
    }

    public boolean existe(String id) {
        return database.buscar("apiarios/" + id, Apiario.class).isPresent();
    }
}
