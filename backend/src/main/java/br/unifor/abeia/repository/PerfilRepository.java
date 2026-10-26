package br.unifor.abeia.repository;

import br.unifor.abeia.model.Perfil;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Repositório em memória para persistência dos dados de Perfil do usuário.
 */
@Repository
public class PerfilRepository {

    private final AtomicReference<Perfil> perfilAtual = new AtomicReference<>();

    public Optional<Perfil> obterPerfil() {
        return Optional.ofNullable(perfilAtual.get());
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
        perfilAtual.set(perfil);
        return perfil;
    }

    public void limpar() {
        perfilAtual.set(null);
    }
}
