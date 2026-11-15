package br.unifor.abeia.repository;

import br.unifor.abeia.model.Perfil;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório de Perfil no Firebase do usuário autenticado.
 */
@Repository
public class PerfilRepository {

    private final FirebaseDatabase database;

    public PerfilRepository(FirebaseDatabase database) {
        this.database = database;
    }

    public void semearDadosIniciais() {
        salvar(new Perfil(database.usuarioId(), "Ildo Ramos", "ildo@email.com", "IR", ""));
    }

    public Optional<Perfil> obterPerfil() {
        return database.buscar("perfil", Perfil.class);
    }

    public Optional<Perfil> obterPerfil(String id) {
        conferirUsuario(id);
        return obterPerfil();
    }

    private void conferirUsuario(String id) {
        if (!database.usuarioId().equals(id)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "O perfil pertence a outro usuário.");
        }
    }

    public Perfil salvar(Perfil perfil) {
        perfil.setId(database.usuarioId());
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
        database.salvar("perfil", perfil);
        return perfil;
    }

    public void limpar() {
        database.excluir("perfil");
    }

    public boolean excluir(String id) {
        conferirUsuario(id);
        return database.excluir("perfil");
    }
}
