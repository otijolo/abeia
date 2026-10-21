package br.unifor.abeia.service;

import br.unifor.abeia.model.Perfil;
import br.unifor.abeia.repository.PerfilRepository;
import org.springframework.stereotype.Service;

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
