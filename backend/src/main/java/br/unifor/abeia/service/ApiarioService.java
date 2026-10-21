package br.unifor.abeia.service;

import br.unifor.abeia.model.Apiario;
import br.unifor.abeia.repository.ApiarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço de Apiários na arquitetura MVC.
 */
@Service
public class ApiarioService {

    private final ApiarioRepository repository;

    public ApiarioService(ApiarioRepository repository) {
        this.repository = repository;
    }

    public List<Apiario> listarTodos() {
        return repository.listarTodos();
    }

    public Optional<Apiario> buscarPorId(String id) {
        return repository.buscarPorId(id);
    }

    public Apiario criar(Apiario apiario) {
        return repository.salvar(apiario);
    }

    public Optional<Apiario> atualizar(String id, Apiario dados) {
        return repository.buscarPorId(id).map(existente -> {
            if (dados.getNome() != null) existente.setNome(dados.getNome());
            if (dados.getCidade() != null) existente.setCidade(dados.getCidade());
            if (dados.getUf() != null) existente.setUf(dados.getUf());
            if (dados.getDescricao() != null) existente.setDescricao(dados.getDescricao());
            if (dados.getVegetacao() != null) existente.setVegetacao(dados.getVegetacao());
            if (dados.getFonteAgua() != null) existente.setFonteAgua(dados.getFonteAgua());
            if (dados.getLatitude() != null) existente.setLatitude(dados.getLatitude());
            if (dados.getLongitude() != null) existente.setLongitude(dados.getLongitude());
            if (dados.getObservacoes() != null) existente.setObservacoes(dados.getObservacoes());
            if (dados.getTotalColmeias() != null) existente.setTotalColmeias(dados.getTotalColmeias());
            if (dados.getStatus() != null) existente.setStatus(dados.getStatus());
            return repository.salvar(existente);
        });
    }

    public boolean excluir(String id) {
        return repository.excluir(id);
    }
}
