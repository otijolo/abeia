package br.unifor.abeia.service;

import br.unifor.abeia.model.Perfil;
import br.unifor.abeia.repository.PerfilRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

/**
 * Camada de serviço de Perfil na arquitetura MVC.
 */
@Service
public class PerfilService {

    private final PerfilRepository repository;

    public PerfilService(PerfilRepository repository) {
        this.repository = repository;
    }

    public Optional<Perfil> obterPerfil() {
        return repository.obterPerfil();
    }

    public Optional<Perfil> obterPerfil(String id) {
        return repository.obterPerfil(id);
    }

    public Perfil criarPerfil(String id, Perfil perfil) {
        if (repository.obterPerfil(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um perfil para este usuário.");
        }
        perfil.setId(id);
        return repository.salvar(perfil);
    }

    public Optional<Perfil> atualizarPerfil(String id, Perfil novosDados) {
        return repository.obterPerfil(id).map(atual -> {
            atual.setNome(novosDados.getNome());
            atual.setEmail(novosDados.getEmail());
            atual.setIniciais(novosDados.getIniciais());
            atual.setTelefone(novosDados.getTelefone());
            return repository.salvar(atual);
        });
    }

    public boolean excluirPerfil(String id) {
        return repository.excluir(id);
    }

    public Perfil salvarPerfil(Perfil perfil) {
        return repository.salvar(perfil);
    }

    public Perfil atualizarPerfil(Perfil novosDados) {
        Perfil atual = repository.obterPerfil().orElse(new Perfil("usr-1", "", "", "", ""));
        if (novosDados.getNome() != null) atual.setNome(novosDados.getNome());
        if (novosDados.getEmail() != null) atual.setEmail(novosDados.getEmail());
        if (novosDados.getIniciais() != null) atual.setIniciais(novosDados.getIniciais());
        if (novosDados.getTelefone() != null) atual.setTelefone(novosDados.getTelefone());
        return repository.salvar(atual);
    }

    public void limparPerfil() {
        repository.limpar();
    }
}
