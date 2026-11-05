package br.unifor.abeia.repository;

import br.unifor.abeia.model.Perfil;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Repositório em memória para persistência dos dados de Perfil do usuário.
 */
@Repository
public class PerfilRepository {

    private final Map<String, Perfil> perfis = new ConcurrentHashMap<>();

    public PerfilRepository() {
        semearDadosIniciais();
    }

    public void semearDadosIniciais() {
        salvar(new Perfil("usr-1", "Ildo Ramos", "ildo@email.com", "IR", "(85) 98888-7777"));
    }
        return obterPerfil("usr-1");
    }

    public Optional<Perfil> obterPerfil(String id) {
        return Optional.ofNullable(perfis.get(id));
    }

    public Perfil salvar(Perfil perfil) {
        if (perfil.getId() == null || perfil.getId().isBlank()) {
            perfil.setId("usr-1");
        }
        if (perfil.getIniciais() == null || perfil.getIniciais().isBlank()) {
            if (perfil.getNome() != null && !perfil.getNome().isBlank()) {
                String[] partes = perfil.getNome().trim().split("\\s+");
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < Math.min(2, partes.length); i++) {
                    if (!partes[i].isEmpty()) {
                        sb.append(Character.toUpperCase(partes[i].charAt(0)));
                    }
                }
                perfil.setIniciais(sb.toString());
            }
        }
        perfis.put(perfil.getId(), perfil);
        return perfil;
    }

    public void limpar() {
        perfis.clear();
    }

    public boolean excluir(String id) {
        return perfis.remove(id) != null;
    }
}
